# Contributing to Inventory POS Frontend

We welcome contributions to this project! Please follow the guidelines below to contribute:

## Guidelines

1. Ensure that you have read and understood the project's purpose and architecture as described in the `README.md` file.
2. Before making any changes, please check the existing issues and pull requests to avoid duplicating work.
3. Fork the repository and create a new branch for your feature or bug fix.
4. Write clear and concise commit messages that describe the changes you have made.
5. Ensure that your code follows the project's coding style and conventions. Use a linter and formatter to maintain consistent code style.
6. Add comments and documentation within the code to make it easier for other developers to understand and maintain.
7. Write unit tests for your changes to ensure code quality and reliability. Place your test files in the `src` directory.
8. Update the `README.md` file if your changes affect the documentation.
9. If your changes involve adding new dependencies, ensure that they are added to the `package.json` file.
10. Implement error handling and validation in your code to improve user experience and prevent potential issues.
11. Ensure that your code handles loading states and errors gracefully.
12. Submit a pull request with a clear description of the changes you have made and the problem they solve.
13. Be responsive to feedback and make any necessary changes requested by the project maintainers.
14. Follow the project's code of conduct and be respectful to other contributors.

## Forking the Repository and Creating a New Branch

1. Fork the repository by clicking the "Fork" button at the top right corner of the repository page.
2. Clone the forked repository to your local machine:
   ```sh
   git clone https://github.com/your-username/inventory-pos-frontend.git
   cd inventory-pos-frontend
   ```
3. Create a new branch for your feature or bug fix:
   ```sh
   git checkout -b your-branch-name
   ```

## Writing Clear Commit Messages and Following Coding Style

1. Write clear and concise commit messages that describe the changes you have made. Use the following format for commit messages:
   ```
   [Component/Feature] Brief description of the change
   ```
   For example:
   ```
   [AddProduct] Add validation for product price
   ```

2. Ensure that your code follows the project's coding style and conventions. Use a linter and formatter to maintain consistent code style. The project includes configuration files for ESLint and Prettier to help with this.
