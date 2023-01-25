import { sendNotifications } from "./notifications/sendNotifications";

interface ICronTask {
  cronFunc: () => void;
  cronExpr: string;
}

const cronTasks: ICronTask[] = [
  { cronFunc: sendNotifications, cronExpr: "* * * * *" },
];

export default cronTasks;
