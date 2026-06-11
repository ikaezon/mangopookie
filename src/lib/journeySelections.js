import { friday, saturday } from '../config/journey'

export function activityLabelsFromIds(activities, selectedIds) {
  return activities
    .filter((activity) => selectedIds.has(activity.id))
    .map((activity) => activity.label)
}

export function getFridayPickLabels(selectedIds) {
  return activityLabelsFromIds(friday.activities, selectedIds)
}

export function getSaturdayPickLabels(selectedIds) {
  return activityLabelsFromIds(saturday.activities, selectedIds)
}
