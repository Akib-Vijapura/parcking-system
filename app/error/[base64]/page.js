'use server';

export default async function Error({ params }) {
    const decoded = decodeURIComponent(params.base64);
    const error = JSON.parse(atob(decoded));

    return (
        <div>
            <h2>{error.status}</h2>
            <span>{error.message}</span>
        </div>
    );
}