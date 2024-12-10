import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Switch,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Select,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { CollapsibleSidebar } from '../../components/layout/CollapsibleSidebar';
import { Navbar } from '../../components/layout/Navbar';
import API from '../../api/api'; // Importar la instancia API configurada
import { useNavigate } from 'react-router-dom';

const UserManagementPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [newUser, setNewUser] = useState({ email: '', name: '', password: '', role: '' });
  const toast = useToast();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  // Cargar usuarios
  const fetchUsers = async () => {
    try {
      const response = await API.get('/users');
      setUsers(response.data);
    } catch (error) {
      toast({
        title: 'Error al cargar usuarios.',
        description: error.response?.data?.message || 'No se pudieron cargar los usuarios',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Cargar roles desde el backend
  const fetchRoles = async () => {
    try {
      setRoles(['ADMIN', 'CASHIER', 'MANAGER']); // Roles definidos en Swagger
    } catch (error) {
      toast({
        title: 'Error al cargar roles.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Activar o desactivar un usuario
  const toggleUserStatus = async (userId, isActive) => {
    try {
      // Usar el endpoint correcto según el estado actual
      const endpoint = isActive 
        ? `/users/${userId}/deactivate`
        : `/users/${userId}/reactivate`;
      
      await API.patch(endpoint);
      
      toast({
        title: `Usuario ${isActive ? 'desactivado' : 'reactivado'} con éxito.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      // Recargar la lista de usuarios
      fetchUsers();
    } catch (error) {
      toast({
        title: 'Error al cambiar el estado del usuario.',
        description: error.response?.data?.message || 'No se pudo actualizar el estado del usuario',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Agregar esta función para manejar la creación de usuarios
  const handleCreateUser = async () => {
    if (!newUser.email || !newUser.name || !newUser.password || !newUser.role) {
      toast({
        title: 'Todos los campos son requeridos.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      await API.post('/auth/register', newUser);
      toast({
        title: 'Usuario creado con éxito.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setNewUser({ email: '', name: '', password: '', role: '' });
      fetchUsers();
      onClose();
    } catch (error) {
      toast({
        title: 'Error al crear el usuario.',
        description: error.response?.data?.message || 'No se pudo crear el usuario',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  return (
    <Box>
      <Navbar onMenuClick={toggleSidebar} />
      <Flex>
        <CollapsibleSidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />
        <Box flex="1" ml={isSidebarOpen ? '240px' : '60px'} p={6}>
          <Flex justify="space-between" align="center" mb={6}>
            <Heading as="h1" size="lg">
              Gestión de Usuarios
            </Heading>
            <Button leftIcon={<AddIcon />} colorScheme="blue" onClick={onOpen}>
              Nuevo Usuario
            </Button>
          </Flex>

          {/* Tabla de usuarios */}
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>ID</Th>
                <Th>Correo</Th>
                <Th>Nombre</Th>
                <Th>Rol</Th>
                <Th>Activo</Th>
              </Tr>
            </Thead>
            <Tbody>
              {users.map((user) => (
                <Tr key={user.id}>
                  <Td>{user.id}</Td>
                  <Td>{user.email}</Td>
                  <Td>{user.name}</Td>
                  <Td>{user.role}</Td>
                  <Td>
                    <Switch
                      isChecked={user.isActive}
                      onChange={() => toggleUserStatus(user.id, user.isActive)}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>

          {/* Modal para nuevo usuario */}
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Crear Nuevo Usuario</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <FormControl mb={4}>
                  <FormLabel>Correo</FormLabel>
                  <Input
                    type="email"
                    placeholder="Correo del usuario"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  />
                </FormControl>
                <FormControl mb={4}>
                  <FormLabel>Nombre</FormLabel>
                  <Input
                    placeholder="Nombre del usuario"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  />
                </FormControl>
                <FormControl mb={4}>
                  <FormLabel>Contraseña</FormLabel>
                  <Input
                    type="password"
                    placeholder="Contraseña"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  />
                </FormControl>
                <FormControl mb={4}>
                  <FormLabel>Rol</FormLabel>
                  <Select
                    placeholder="Selecciona un rol"
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  >
                    {roles.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="blue" onClick={handleCreateUser}>
                  Guardar
                </Button>
                <Button variant="ghost" ml={3} onClick={onClose}>
                  Cancelar
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </Box>
      </Flex>
    </Box>
  );
};

export default UserManagementPage;
