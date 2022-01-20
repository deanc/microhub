type PaginationLimits = [number, number]

class Pagination {
  totalResults: number
  currentPage: number
  limit: number
  pages = 1

  constructor(totalResults: number, currentPage: number, limit = 5) {
    this.totalResults = totalResults
    this.currentPage = currentPage
    this.limit = limit

    this._calculatePages()
  }

  setPage(page: number) {
    if (page > this.pages) {
      throw new Error("Page exceeds maximum pages")
    }
    this.currentPage = page
  }

  _calculatePages(): void {
    this.pages = Math.ceil(this.totalResults / this.limit)
  }

  limits(): PaginationLimits {
    let lower = (this.currentPage - 1) * this.limit

    return [lower, this.limit]
  }

  hasNextPage(): boolean {
    return this.pages > this.currentPage
  }

  hasPrevPage(): boolean {
    return this.currentPage > 1 && this.currentPage <= this.pages
  }

  getPrevPage(): number {
    return this.currentPage - 1
  }
  getNextPage(): number {
    return this.currentPage + 1
  }

  totalPages(): number {
    return this.pages
  }

  _prevUrl(): string {
    let prevPage = this.getPrevPage()
    if (prevPage === 1) {
      return "?"
    }
    return `?page=${prevPage}`
  }

  render(): string {
    let str = ""
    const hasPrev = this.hasPrevPage()
    const hasNext = this.hasNextPage()
    if (hasPrev) {
      str += `<a href="${this._prevUrl()}">< prev page</a>`
    }
    if (hasPrev && hasNext) {
      str += ` <em class="s">/</em>`
    }
    if (hasNext) {
      str += ` <a href="?page=${this.getNextPage()}">next page ></a>`
    }
    return str
  }
}

export default Pagination
