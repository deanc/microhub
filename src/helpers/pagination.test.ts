import Pagination from "./pagination"

describe("Pagination", () => {
  describe("calculates total number of pages correctly", () => {
    it("if item count is divisible", () => {
      const pagination = new Pagination(20, 1, 5)
      expect(pagination.totalPages()).toBe(4)
    })
    it("if item count is not divisible", () => {
      const pagination = new Pagination(21, 1, 5)
      expect(pagination.totalPages()).toBe(5)
    })
    it("if item count is equal", () => {
      const pagination = new Pagination(20, 1, 20)
      expect(pagination.totalPages()).toBe(1)
    })
  })

  describe("calculates limit values correctly", () => {
    describe("simple case", () => {
      let pagination: Pagination
      beforeAll(() => {
        pagination = new Pagination(20, 1, 5)
      })
      it("first page", () => {
        expect(pagination.limits()).toStrictEqual([0, 5])
      })
      it("second page", () => {
        pagination.setPage(2)
        expect(pagination.limits()).toStrictEqual([5, 5])
      })
      it("third page", () => {
        pagination.setPage(3)
        expect(pagination.limits()).toStrictEqual([10, 5])
      })
      it("fourth page", () => {
        pagination.setPage(4)
        expect(pagination.limits()).toStrictEqual([15, 5])
      })
      it("exceeds max pages", () => {
        expect(() => pagination.setPage(5)).toThrowError()
      })
    })
    // describe("complicated case", () => {
    //   let pagination: Pagination
    //   beforeAll(() => {
    //     pagination = new Pagination(74, 1, 13)
    //     expect(pagination.totalPages).toBe(6)
    //   })

    //   it.each([0,1,2,3,4,5,6], () => {

    //   };
    //   for (let c = 0; c <= 6; c++) {
    //     expect(pagination.limits()).toBe([c * 13, 13])
    //   }
    // })
  })
})
