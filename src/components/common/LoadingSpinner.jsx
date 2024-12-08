import { Spinner, Center } from '@chakra-ui/react';

export const LoadingSpinner = ({ size = 'xl', ...props }) => {
  return (
    <Center h="100%" {...props}>
      <Spinner size={size} />
    </Center>
  );
};
