import {AnalyticEvents, EventName} from "../interfaces/analytics";
import {analytic} from "./analytic";

export const analyticEvents: AnalyticEvents = {
  [EventName.GITHUB_CONNECTED]: [analytic("ga4")],
  [EventName.WALLET_ADDRESS_CHANGED]: [analytic("ga4")],
  task_section_change_select_network: [analytic("ga4")],
  task_section_change_bounty_details: [analytic("ga4")],
  task_section_change_reward_information: [analytic("ga4")],
  task_section_change_create_task: [analytic("ga4")],
  create_task_approve_amount: [analytic("ga4")],
  create_pre_task: [analytic("ga4")],
  created_task: [analytic("ga4")],
}