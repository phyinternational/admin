import { useGetUser } from '@/lib/react-query/auth-query';
import { Button } from '@/components/ui/button';

export const AuthDebug = () => {
  const { data, isLoading, isError, error, refetch } = useGetUser();

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h3 className="font-bold mb-2">Authentication Debug</h3>
      <div className="space-y-2 text-sm">
        <p><strong>Loading:</strong> {isLoading ? 'Yes' : 'No'}</p>
        <p><strong>Error:</strong> {isError ? 'Yes' : 'No'}</p>
        <p><strong>User Data:</strong> {data ? 'Present' : 'None'}</p>
        {error && <p><strong>Error Details:</strong> {error.message}</p>}
      </div>
      <Button onClick={() => refetch()} className="mt-2">
        Test Authentication
      </Button>
    </div>
  );
};