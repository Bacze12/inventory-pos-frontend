import { Alert, AlertIcon, AlertTitle, AlertDescription } from '@chakra-ui/react';

export const AlertMessage = ({ status = 'info', title, description, ...props }) => {
  return (
    <Alert status={status} {...props}>
      <AlertIcon />
      {title && <AlertTitle>{title}</AlertTitle>}
      {description && <AlertDescription>{description}</AlertDescription>}
    </Alert>
  );
};
