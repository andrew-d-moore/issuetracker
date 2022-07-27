$(document).ready(() => {
  document.getElementById('issueInputForm').addEventListener('submit', saveIssue)
})

const getUUID = async () => {
  return $.get('https://mscoreapi.mutesol.com/getUUID', (res) => {
    return res
  })
}

const getIssues = () => {
  return JSON.parse(localStorage.getItem('issues'))
}

const setIssues = (issues) => {
  localStorage.setItem('issues', JSON.stringify(issues))
  return true
}

const fetchIssues = () => {
  let issues = getIssues()
  let issuesList = document.getElementById('issuesList')

  issuesList.innerHTML = ''

  if (issues != null) {
    const closed = (status, id) => {
      if (status === 'Closed')
        return `<a href="#" class="btn btn-success" onclick="reopen('${id}')">ReOpen</a>`
      else return ``
    }

    for (let i = 0; i < issues.length; i++) {
      let id = issues[i].id
      let desc = issues[i].description
      let severity = issues[i].severity
      let assignedTo = issues[i].assignedTo
      let status = issues[i].status
      issuesList.innerHTML += `
        <div class="card mt-2">
          <div class="card-header">
            <div class="row">
              <div class="col-6">
                <h6 class="card-title">Issue ID: ${id}</h6>
              </div>
              <div class="col">
                <span class="label label-info">Status: ${status}</span>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <span class="glyphicon glyphicon-time"></span>Severity: ${severity}
              </div>
              <div class="col">
                <span class="glyphicon glyphicon-user"></span>Assigned: ${assignedTo}
              </div>
            </div>
          </div>
          <div class="card-body text-center">
            <h3>${desc}</h3>
          </div>
          <div class="card-footer text-center">
            <a href="#" class="btn btn-outline-warning" onclick="setStatusClosed('${id}')">Close</a>
            <a href="#" class="btn btn-danger" onclick="deleteIssue('${id}')">Delete</a>
            `+ closed(status, id) +`
          </div>
        </div>`
    }
  }
}

const saveIssue = async (e) => {
  let issue = {
    id: await getUUID(),
    description: document.getElementById('issueDescInput').value,
    severity: document.getElementById('issueSeverityInput').value,
    assignedTo: document.getElementById('issueAssignedToInput').value,
    status: 'Open'
  }
  if (getIssues() === null) {
    let issues = []
    issues.push(issue)
    setIssues(issues)
  } else {
    let issues = getIssues()
    issues.push(issue)
    setIssues(issues)
  }
  document.getElementById('issueInputForm').reset()
  fetchIssues()
  e.preventDefault()
}

const setStatusClosed = (id) => {
  let issues = getIssues()
  for (let i = 0; i < issues.length; i++)
    if (issues[i].id == id)
      issues[i].status = 'Closed'
  setIssues(issues)
  fetchIssues()
}

const reopen = (id) => {
  let issues = getIssues()
  for (let i = 0; i < issues.length; i++)
    if (issues[i].id == id)
      issues[i].status = 'Open'
  setIssues(issues)
  fetchIssues()
}

const deleteIssue = (id) => {
  let issues = getIssues()
  for (let i = 0; i < issues.length; i++)
    if (issues[i].id == id)
      issues.splice(i, 1)
  setIssues(issues)
  fetchIssues()
}
