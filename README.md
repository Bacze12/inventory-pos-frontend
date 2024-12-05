# Inventory POS Frontend

This project is a frontend application for an inventory point-of-sale (POS) system. It allows users to manage products and sales, including adding, updating, and deleting products, as well as recording and viewing sales.

## Project Architecture

The project is built using React and follows a component-based architecture. The main components are organized in the `src/components` directory, and the application routes are defined in `src/App.jsx` using `react-router-dom`.

### Components

- `src/components/AddProduct.jsx`: A component for adding new products.
- `src/components/AddSale.jsx`: A component for recording new sales.
- `src/components/DeleteProduct.jsx`: A component for deleting products.
- `src/components/ProductDetails.jsx`: A component for displaying product details.
- `src/components/ProductList.jsx`: A component for listing all products.
- `src/components/SaleDetails.jsx`: A component for displaying sale details.
- `src/components/SalesList.jsx`: A component for listing all sales.
- `src/components/UpdateProduct.jsx`: A component for updating product details.
- `src/components/ui/theme-provider.jsx`: A component for providing the theme to the application.

### API Configuration

The `src/api.js` file contains the configuration for Axios, which is used for making API requests to the backend.

### Error Handling

The `src/ErrorBoundary.jsx` file contains an error boundary component to catch and handle errors in the application.

## Contributing

We welcome contributions to this project! Please follow the guidelines below to contribute:

1. Ensure that you have read and understood the project's purpose and architecture as described in this `README.md` file.
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

## Setting Up the Development Environment

To set up the development environment for this project, follow these steps:

1. Clone the repository to your local machine:
   ```sh
   git clone https://github.com/Bacze12/inventory-pos-frontend.git
   cd inventory-pos-frontend
   ```

2. Install the project dependencies using npm:
   ```sh
   npm install
   ```

3. Create a `.env` file in the root directory of the project and add the necessary environment variables. You can use the `.env.example` file as a template.

4. Start the development server:
   ```sh
   npm start
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## Running Tests and Building the Project

### Running Tests

To run the tests for this project, use the following command:
```sh
npm test
```
This will launch the test runner in the interactive watch mode. Ensure that all tests pass before submitting a pull request.

### Building the Project

To build the project for production, use the following command:
```sh
npm run build
```
This will create an optimized production build in the `build` folder. The build is minified, and the filenames include the hashes. Your app is ready to be deployed!

For more information on deployment, refer to the [Create React App documentation](https://facebook.github.io/create-react-app/docs/deployment).
