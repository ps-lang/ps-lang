/**
 * Convex Cron Jobs for Data Retention
 *
 * Runs scheduled tasks to enforce data retention policies based on user tiers
 */

import { cronJobs } from "convex/server"
import { internal } from "./_generated/api"

const crons = cronJobs()

/**
 * Daily job: Anonymize data that has passed the anonymization threshold
 * Runs at 2 AM UTC daily
 */
crons.daily(
  "anonymize-expired-data",
  {
    hourUTC: 2,
    minuteUTC: 0,
  },
  internal.dataRetention.anonymizeExpiredData
)

/**
 * Daily job: Delete data that has passed the retention threshold
 * Runs at 3 AM UTC daily
 */
crons.daily(
  "delete-expired-data",
  {
    hourUTC: 3,
    minuteUTC: 0,
  },
  internal.dataRetention.deleteExpiredData
)

/**
 * Weekly job: Aggregate research contributor data after 2 years
 * Runs every Sunday at 4 AM UTC
 */
crons.weekly(
  "aggregate-research-data",
  {
    dayOfWeek: "sunday",
    hourUTC: 4,
    minuteUTC: 0,
  },
  internal.dataRetention.aggregateResearchData
)

export default crons
