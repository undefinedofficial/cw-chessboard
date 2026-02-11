export type Task = () => Promise<void>;

export class PromiseQueue {
  private isRunning: boolean;
  private tasks: Task[];

  /**
   * check if queue is running
   */
  get IsRunning() {
    return this.isRunning;
  }

  /**
   * number of tasks in queue
   */
  get Size() {
    return this.tasks.length;
  }

  constructor() {
    this.isRunning = false;
    this.tasks = [];
  }

  /**
   * Add task to queue return promise that will be resolved when task is finished
   */
  addTask<T>(task: Task): Promise<T> {
    return new Promise<any>((resolve, reject) => {
      this.tasks.push(() => task().then(resolve).catch(reject));
      this.run();
    });
  }

  /**
   * run tasks in queue
   */
  private async run() {
    if (this.isRunning) return;
    this.isRunning = true;
    while (this.tasks.length) await this.tasks.shift()!();

    this.isRunning = false;
  }

  /**
   * terminate all tasks
   */
  clear() {
    this.tasks.length = 0;
    this.isRunning = false;
  }
}
