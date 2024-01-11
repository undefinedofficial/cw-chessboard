export type Task = () => Promise<void>;

export function useQueue() {
  let isRunning = false;
  const tasks: Task[] = [];

  function IsRunning() {
    return isRunning;
  }

  /** Add task to queue return promise that will be resolved when task is finished */
  function addTask(task: Task) {
    return new Promise((resolve, reject) => {
      tasks.push(() => {
        return task().then(resolve).catch(reject);
      });
    });
  }

  /** run tasks in queue */
  async function run() {
    if (!isRunning) {
      while (tasks.length) {
        isRunning = true;
        await tasks.shift()!();
        isRunning = false;
      }
    }
    return Promise.resolve();
  }

  /* terminate all tasks */
  function clear() {
    tasks.length = 0;
    isRunning = false;
  }

  return { IsRunning, run, addTask, clear };
}
