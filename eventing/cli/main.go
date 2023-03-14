package main

import (
	"embed"
	"fmt"
	"io/fs"
	"log"
	"os"
	"os/exec"
	"path/filepath"
	"time"

	"github.com/briandowns/spinner"
	"github.com/go-resty/resty/v2"
	"github.com/urfave/cli/v2"
)

//go:embed newprojfiles
var newprojfiles embed.FS

const BACKEND_URL = "http://localhost:3000"

func main() {
	client := resty.New()

	app := &cli.App{
		Commands: []*cli.Command{
			{
				Name:  "init",
				Usage: "initialize",
				Action: func(cCtx *cli.Context) error {
					projectName := cCtx.Args().First()
					projectPath := filepath.Join(".", projectName)
					err := os.MkdirAll(projectPath, os.ModePerm)
					if err != nil {
						return err
					}

					cmd := exec.Command("npm", "init", "es6", "--yes")
					cmd.Dir = projectPath
					err = cmd.Run()
					if err != nil {
						return err
					}

					files, err := newprojfiles.ReadDir("newprojfiles/node")
					if err != nil {
						return err
					}

					for _, file := range files {
						data, err := newprojfiles.ReadFile("newprojfiles/node/" + file.Name())
						if err != nil {
							return err
						}

						err = os.WriteFile(filepath.Join(projectPath, file.Name()), data, fs.ModePerm)
						if err != nil {
							return err
						}
					}

					return nil
				},
			},
			{
				Name:  "deploy",
				Usage: "deploys actions that respond to events",
				Action: func(cCtx *cli.Context) error {
					fmt.Println("Deploying...")
					s := spinner.New(spinner.CharSets[0], 100*time.Millisecond)

					s.Start()
					config, err := os.ReadFile("./cupcake.json")
					if err != nil {
						return err
					}
					packageJson, err := os.ReadFile("./package.json")
					if err != nil {
						return err
					}
					jsHandlers, err := os.ReadFile("./handlers.js")
					if err != nil {
						return err
					}
					dartfile, err := os.ReadFile("./server.dart")
					if err != nil {
						return err
					}

					type File struct {
						Content string `json:"content"`
					}
					type Body struct {
						Config      File `json:"config"`
						PackageJson File `json:"package_json"`
						JsHandlers  File `json:"js_handlers"`
						Dartfile    File `json:"dartfile"`
					}
					reqBody := Body{
						Config: File{
							Content: string(config),
						},
						PackageJson: File{
							Content: string(packageJson),
						},
						JsHandlers: File{
							Content: string(jsHandlers),
						},
						Dartfile: File{
							Content: string(dartfile),
						},
					}

					response, err := client.R().ForceContentType("json").SetBody(reqBody).Post(BACKEND_URL + "/deploy")

					s.Stop()

					if err != nil {
						return err
					}

					print(response.StatusCode())

					return nil
				},
			},
		},
	}

	if err := app.Run(os.Args); err != nil {
		log.Fatal(err)
	}
}
