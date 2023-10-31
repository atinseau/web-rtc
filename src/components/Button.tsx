import classNames from "classnames"

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>

export function Button({ children, className, ...props }: ButtonProps) {
  return <button {...props} className={classNames("bg-gray-100 p-2 rounded-md hover:bg-gray-300", className)}>
    {children}
  </button>
}