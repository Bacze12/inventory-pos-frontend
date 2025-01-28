import React, { useState, useEffect, useCallback } from 'react';
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
  IconButton,
} from '@chakra-ui/react';
import { AddIcon, EditIcon } from '@chakra-ui/icons';
import CollapsibleSidebar from '../../components/layout/CollapsibleSidebar';
import  Navbar  from '../../components/layout/Navbar';
import API from '../../api/api';
import EditUserModal from '../../components/user/EditUserModal';

const UserManagementPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [newUser, setNewUser] = useState({ email: '', name: '', password: '', role: '' });
  const toast = useToast();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'active', 'inactive'
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  // Cargar usuarios
  const fetchUsers = useCallback(async () => {
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
  }, [toast]);

  // Cargar roles desde el backend
  const fetchRoles = useCallback(async () => {
    try {
      setRoles(['ADMIN', 'CASHIER', 'MANAGER']);
    } catch (error) {
      toast({
        title: 'Error al cargar roles.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  }, [toast]);

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, [fetchUsers, fetchRoles]);

  // Activar o desactivar un usuario
  const toggleUserStatus = async (userId, isActive) => {
  try {
    // Cambiar el estado (isActive) enviando un body en la solicitud
    await API.patch(`/users/${userId}/active`, { isActive: !isActive });
    toast({
      title: `Usuario ${!isActive ? 'activado' : 'desactivado'} con éxito.`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    // Recargar la lista de usuarios
    await fetchUsers();
  } catch (error) {
    toast({
      title: 'Error al cambiar estado del usuario',
      description: error.response?.data?.message || 'No se pudo actualizar el estado',
      status: 'error',
      duration: 3000,
      isClosable: true,
    });
  }
};


  const handleCreateUser = async () => {
    const tenantId = localStorage.getItem('tenantId'); // Obtener el tenantId del almacenamiento local
    const newUserWithTenantId = { ...newUser, tenantId }; // Incluir el tenantId en los datos del nuevo usuario

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
      await API.post('/users', newUserWithTenantId);
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

  const filteredUsers = users.filter(user => {
    if (statusFilter === 'all') return true;
    if (statusFilter === 'active') return user.isActive;
    if (statusFilter === 'inactive') return !user.isActive;
    return true;
  });

  const handleOpenEditModal = (user) => {
    setSelectedUser(user);
    setEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setSelectedUser(null);
  };

  const handleUserUpdated = () => {
    fetchUsers(); // Recarga la lista de usuarios después de la actualización
  };

  return (
    <Box bg="gray.50" minH="100vh">
      <Navbar onMenuClick={toggleSidebar} />
      <Flex>
        <CollapsibleSidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />
        <Box flex="1" ml={isSidebarOpen ? '0px' : '0px'} p={6}>
          <Flex justify="space-between" align="center" mb={6}>
            <Heading as="h1" size="lg" >
              Gestión de Usuarios
            </Heading>
            <Button leftIcon={<AddIcon />} colorScheme="blue" onClick={onOpen} size="lg">
              Nuevo Usuario
            </Button>
          </Flex>

          <Flex justify="space-between" align="center" mb={4}>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              width="200px"
            >
              <option value="all">Todos los usuarios</option>
              <option value="active">Usuarios activos</option>
              <option value="inactive">Usuarios inactivos</option>
            </Select>
          </Flex>

          <Box bg="white" p={6} borderRadius="lg" shadow="md">
            <Table variant="simple">
              <Thead bg="gray.100">
                <Tr>
                  <Th>Correo</Th>
                  <Th>Nombre</Th>
                  <Th>Rol</Th>
                  <Th>Estado</Th>
                  <Th>Acciones</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredUsers.map((user) => (
                  <Tr key={user._id}>
                    <Td>{user.email}</Td>
                    <Td>{user.name}</Td>
                    <Td>{user.role}</Td>
                    <Td>
                      <Switch
                        colorScheme="green"
                        isChecked={user.isActive}
                        onChange={() => toggleUserStatus(user._id, user.isActive)}
                      />
                    </Td>
                    <Td>
                      <IconButton
                        icon={<EditIcon />}
                        colorScheme="blue"
                        variant="outline"
                        onClick={() => handleOpenEditModal(user)}
                        aria-label="Editar usuario"
                        ml={2}
                      />
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>

            <EditUserModal
            isOpen={isEditModalOpen}
            onClose={handleCloseEditModal}
            user={selectedUser}
            onUserUpdated={handleUserUpdated}
          />
          </Box>

          <Modal isOpen={isOpen} onClose={onClose} size="lg">
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
                <Button colorScheme="blue" onClick={handleCreateUser} size="lg">
                  Guardar
                </Button>
                <Button variant="ghost" ml={3} onClick={onClose} size="lg">
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