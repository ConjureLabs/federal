## Contributing to Federal

### Setting up Local Development

1. [Fork](https://help.github.com/articles/fork-a-repo/) this repo using your own GitHub account and then [clone](https://help.github.com/articles/cloning-a-repository/) it to your machine
2. Run `npm install` to install project dependencies
3. Within a another directory, set up a test project which will use Federal
4. Run `npm install ../federal` to install your local clone as a dependency (where `../federal` should be the path to your local clone)

### Opening a Pull Request

1. First make changes locally, and verify they are working within your own local test project
2. Comment your code
3. Add unit tests to your changes, if applicable
4. Run `npm test` to verify your changes pass sanity checks
5. Push your code up to a branch on GitHub
6. Open a PR to request changes merged, with a clearly worded PR description

### Opening an Issue

If you can open a PR to patch a bug or suggest a feature, it will get more attention.
