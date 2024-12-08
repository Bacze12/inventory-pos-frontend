import React, { Component } from 'react';
import { Box, Text, Button } from '@chakra-ui/react';

/**
 * ErrorBoundary Component
 * Captura errores en componentes secundarios y muestra un mensaje amigable.
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    // Actualiza el estado para mostrar la interfaz de fallback.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Puedes enviar el error a un servicio de monitoreo, como Sentry.
    console.error('ErrorBoundary capturó un error:', error, errorInfo);
  }

  handleRetry = () => {
    // Reinicia el estado del error.
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box textAlign="center" py={10} px={6}>
          <Text fontSize="lg" color="red.500" mb={4}>
            Ocurrió un error inesperado.
          </Text>
          <Button colorScheme="blue" onClick={this.handleRetry}>
            Intentar de nuevo
          </Button>
        </Box>
      );
    }

    // Renderiza los componentes secundarios normalmente si no hay errores.
    return this.props.children;
  }
}

export default ErrorBoundary;
