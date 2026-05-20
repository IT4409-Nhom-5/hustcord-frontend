import { useQuery } from '@tanstack/react-query';
import { useUserStore } from '~/stores/user.store';
import { userAPI } from '~/lib/api/user.api';

export function useUser(userId: string) {
  const { getUser, addUser } = useUserStore();

  const cachedUser = getUser(userId);

  const { data } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => userAPI.getById(userId).then((res) => res.data),
    enabled: !!userId && !cachedUser,
    onSuccess: (user) => addUser(user),
  });

  return data || cachedUser;
}

export function useUsers(userIds: string[]) {
  const { addUsers } = useUserStore();

  const { data } = useQuery({
    queryKey: ['users', ...userIds],
    queryFn: async () => {
      const users = await Promise.all(
        userIds.map((id) => userAPI.getById(id).then((res) => res.data))
      );
      return users;
    },
    enabled: userIds.length > 0,
    onSuccess: (users) => addUsers(users),
  });

  return data || [];
}
