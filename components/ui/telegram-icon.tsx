/**
 * Иконка «Телеграм» в той же нейтральной обводке 1.75px и цветом
 * currentColor, что и AvitoIcon — контур бумажного самолётика, а не
 * фирменный синий кружок платформы, чтобы не спорить с палитрой страницы.
 */
export function TelegramIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M21 4.5 3 11.7l6 2.1" />
      <path d="M9 13.8v5.4l3.3-3" />
      <path d="M9 13.8 21 4.5l-3.6 15-8.4-5.7Z" />
    </svg>
  )
}
