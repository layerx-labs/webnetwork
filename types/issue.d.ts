import Issue from "db/models/issue.model";

interface IssueResponse {
    count: number;
    results: Issue[];
    pages: number;
    currentPage: number;
  }
  