interface InjectCacheOptions {
  id: string;
  to: string;
  content: string;
}

export function useInjectCache({ id, to, content }: InjectCacheOptions) {
  function remove() {
    const container = document.getElementById(id);
    if (container) container.remove();
  }

  if (document.getElementById(id)) return { remove };

  const container = document.createElement("div");
  container.id = id;
  container.innerHTML = content;
  const wrapper = document.querySelector(to);
  if (!wrapper) throw new Error(`Element with selector "${to}" not found.`);
  wrapper.appendChild(container);

  return { remove };
}
