/**
 * Иконка «Авито» в единой обводке 1.75px и цветом currentColor —
 * без фирменного зелёного, чтобы не спорить с палитрой страницы.
 * Это не логотип платформы, а нейтральный знак «объявление».
 */
export function AvitoIcon({ className }: { className?: string }) {
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
      <circle cx="8" cy="8" r="4.2" />
      <circle cx="17.2" cy="6.6" r="2.4" />
      <circle cx="6.6" cy="17.4" r="2.4" />
      <circle cx="16" cy="16" r="4.2" />
    </svg>
  )
}
