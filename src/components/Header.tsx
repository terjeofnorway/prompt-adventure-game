interface HeaderProps {
  className?: string;
}

export const Header = ({ className }: HeaderProps) => {
    return (
        <header className={className}>
            <h1>Header</h1>
        </header>
    )
}