import api from '../middleware/axios.interceptor';

export interface LoginDTO {
  email: string;
  password: string;
}

export interface RegisterDTO {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
}

export interface UserResponseDTO {
  id: number;
  email: string;
  role: string;
  createdAt: string;
  profile?: {
    firstName: string;
    lastName: string;
    phone: string;
    address: string;
  };
}

// ✅ Nouveau format retourné par POST /api/auth/login
export interface AuthResponseDTO {
  token: string;
  user: UserResponseDTO;
}

const authService = {
  // POST /api/auth/login → AuthResponseDTO { token, user }
  login: (dto: LoginDTO) =>
    api.post<AuthResponseDTO>('/auth/login', dto),

  // POST /api/auth/register → UserResponseDTO
  register: (dto: RegisterDTO) =>
    api.post<UserResponseDTO>('/auth/register', dto),
};

export default authService;