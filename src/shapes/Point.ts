/**
 * 点 
 * 
 * @class Point
 */
class Point {
  x: number;
  y: number;

  /**
   * Creates an instance of Point.
   * @param {number} [x=0]
   * @param {number} [y=0] 
   * @memberof Point
   */
  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }
}

export default Point;