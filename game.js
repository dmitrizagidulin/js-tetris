
	square_side = 20
	square_color = "green"
	game_area_x = 50
	game_area_y = 20
	ticks_per_cycle = 35

	num_rows = 20
	last_row = num_rows
	num_cols = 11
	last_col = num_cols
	game_area_height = square_side * num_rows
	game_area_width = square_side * num_cols
	
	// Cell abbreviations, for use with Sparse Representation
	// Taken from https://github.com/troglobit/tetris/blob/master/tetris.c 
	// via https://github.com/Johnicholas/TetrisClone/blob/master/tetris_clone.js
	var tl = { row: -1, col: -1 }; // top left
	var tc = { row: -1, col: 0 }; // top center
	var tr = { row: -1, col: 1 }; // top right
	var ml = { row: 0, col: -1 }; // middle left
	var mr = { row: 0, col: 1 }; // middle right
	var bl = { row: 1, col: -1 }; // bottom left
	var bc = { row: 1, col: 0 }; // bottom center
	var br = { row: 1, col: 1 }; // bottom right

	function Shape(row, col) {
		this.col = col
		this.row = row
		
		this.draw = function() {
			jaws.context.strokeStyle = "black"
			jaws.context.fillStyle = square_color
			jaws.context.lineWidth = 3
			
			var x = game_area_x + ((this.col - 1) * square_side)
			var y = game_area_y + (this.row * square_side)
			jaws.context.strokeRect(x, y, square_side, square_side)
			jaws.context.fillRect(x, y, square_side, square_side)
		}
		
		this.moveDown = function() {
			this.row++
		}
		
		this.moveRight = function() {
			this.col++
			if(this.col > num_cols) this.col--
		}
		
		this.moveLeft = function() {
			this.col--
			if(this.col < 1) this.col++
		}
		
		this.hitBottom = function() {
			if((this.row + 1) >= last_row) {
				return true
			} else {
				return false
			}
		}
	}

/**
* GameState is the actual game play. We switch to it once user choses "Start game"
*
*/
	function GameState() {
		var jc = jaws.context
		
		this.setup = function() {
			this.cycle_ticks = 0
			
			this.shape = new Shape(1, 5)
			
			this.is_piece_moving = true
			
			that = this
			
		    jaws.on_keydown("left",  function () { that.currentShape().moveLeft() })
		    jaws.on_keydown("right",  function () { that.currentShape().moveRight() })
		}
		
		this.currentShape = function() {
			return this.shape
		}

		this.drawGrid = function() {
			var line_height = 0

			jc.lineWidth = 0.3
			jc.strokeStyle = "white"
			
			// draw horizontal lines of grid
			for(var i=1; i < num_rows; i++) {
				line_height = game_area_y + (i * square_side)
				jc.beginPath()
				jc.moveTo(game_area_x, line_height)
				jc.lineTo(game_area_width + game_area_x, line_height)
				jc.stroke()
				jc.closePath()
			}
			
			// Draw vertical lines of grid
			for(var i=1; i < num_cols; i++) {
				line_width = game_area_x + (i * square_side)
				jc.beginPath()
				jc.moveTo(line_width, game_area_y)
				jc.lineTo(line_width, game_area_y + game_area_height)
				jc.stroke()
			}
		}
		
		this.draw = function() {
			// Clear screen
			jaws.context.fillStyle = "black"
			jaws.context.fillRect(0,0,jaws.width,jaws.height)
			
			// Draw game area
			jaws.context.strokeStyle = "white"
			jaws.context.lineWidth = 1
			jaws.context.strokeRect(game_area_x, game_area_y, game_area_width, game_area_height)

			this.drawGrid()
			
			// Draw the current shape
			this.currentShape().draw()
		}
		
		this.update = function() {
			this.cycle_ticks++
			if(this.cycle_ticks >= ticks_per_cycle) {
				this.cycle_ticks = 0
				this.updateTick()
			}
		}
		
		this.updateTick = function() {
			if(this.shape.hitBottom()) {
				this.is_piece_moving = false
			} else {
				if(this.is_piece_moving) {
					this.shape.moveDown()
				}
			}
		}
	}
	
/**
* Start menu
*
*/
	function MenuState() {
		this.setup = function() {
			index = 0
			jaws.on_keydown(["down","s"],       function()  { index++; if(index >= items.length) {index=items.length-1} } )
			jaws.on_keydown(["up","w"],         function()  { index--; if(index < 0) {index=0} } )
			jaws.on_keydown(["enter","space"],  function()  {
				jaws.switchGameState(GameState)
			})
		}
		
		this.draw = function() {
			jaws.context.clearRect(0,0,jaws.width,jaws.height)

			// Draw Title
			drawText(60, "Green", "Tetris", 200, 150)

		}
	}
 
/**
* Our script-entry point
*
*/
	window.onload = function() {
		jaws.start(MenuState)
	}