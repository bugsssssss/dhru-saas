export default function ApplicationLogo(props) {
    return (
        <img
            {...props}
            src="/logo.png" // Replace with the actual path to your PNG file
            alt="Application Logo"
            className="w-32 p-2"
        />
    );
}
