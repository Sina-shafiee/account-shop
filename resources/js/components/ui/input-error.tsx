export function InputError({ message }: { message?: string }) {
    return <p className='text-red-500 mt-2 text-sm'>{message}</p>;
}
