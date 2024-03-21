interface InjectCacheOptions {
  id: string;
  className?: string;
  to: string;
  content: string;
}

export function useInjectCache({ id, className, to, content }: InjectCacheOptions) {
  function remove() {
    const container = document.getElementById(id);
    if (container) container.remove();
  }

  if (document.getElementById(id)) return { remove };

  const container = document.createElement("div");
  container.id = id;
  if (className) container.classList.add(className);
  container.innerHTML = content;
  const wrapper = document.querySelector(to);
  if (!wrapper) throw new Error(`Element with selector "${to}" not found.`);
  wrapper.appendChild(container);

  return { remove };
}
