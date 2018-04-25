/**
 * 点 
 * 
 * @class Point
 */
class Point {
  private x: number;
  private y: number;

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

  public setXY(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public getX(): number {
    return this.x;
  }

  public setX(x: number): void {
    this.x = x;
  }

  public getY(): number {
    return this.y;
  }

  public setY(y: number) {
    this.y = y;
  }
}

export default Point;