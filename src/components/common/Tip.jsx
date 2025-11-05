export default function Tip({ className = "", ...props }) {
    return (
        <div className={`flex items-start gap-2 p-3 bg-primary/10 border-l-4 border-primary ${className}`}>
            <p className="text-sm text-text-primary dark:text-white">
                {props.children}
            </p>
        </div>
    )
}