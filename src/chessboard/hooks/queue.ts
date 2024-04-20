export type Task = () => Promise<void>;

export function useQueue() {
  let isRunning = false;
  const tasks: Task[] = [];
  const waits: Task[] = [];

  /**
   * check if queue is running
   */
  function IsRunning() {
    return isRunning;
  }

  /**
   * Add task to queue return promise that will be resolved when task is finished
   */
  function addTask<T>(task: Task): Promise<T> {
    return new Promise<any>((resolve, reject) =>
      tasks.push(() => task().then(resolve).catch(reject))
    );
  }

  /**
   * run tasks in queue
   */
  async function run() {
    if (!isRunning) {
      isRunning = true;
      while (tasks.length) await tasks.shift()!();

      waits.forEach((w) => w());
      waits.length = 0;
      isRunning = false;
    }
  }

  /**
   * wait for all tasks to finish
   */
  function wait() {
    return new Promise<void>((resolve) => waits.push(resolve as Task));
  }

  /**
   * terminate all tasks
   */
  function clear() {
    tasks.length = 0;
    isRunning = false;
  }

  return { IsRunning, run, addTask, clear, wait };
}
