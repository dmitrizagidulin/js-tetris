
	square_side = 20
	square_color = "green"
	game_area_x = 50
	game_area_y = 20
	ticks_per_cycle = 45

	num_rows = 7
	last_row = num_rows
	num_cols = 4
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
			
			var x = game_area_x + (this.col * square_side)
			var y = game_area_y + (this.row * square_side)
			jaws.context.strokeRect(x, y, square_side, square_side)
			jaws.context.fillRect(x, y, square_side, square_side)
		}
		
		this.moveDown = function(map) {
			this.row++
		}
		
		this.moveRight = function() {
			this.col++
			if(this.col >= num_cols) this.col--
		}
		
		this.moveLeft = function() {
			this.col--
			if(this.col < 0) this.col++
		}
		
		this.hitBottom = function(map) {
			var new_row = this.row + 1
			if(new_row >= last_row) {
				return true
			}
			if(map[new_row][this.col]) {
				return true
			}
			
			return false
		}
	}

/**
* GameState is the actual game play. We switch to it once user choses "Start game"
*
*/
	function GameState() {
		var jc = jaws.context
		this.map = []
		
		this.setup = function() {
			this.cycle_ticks = 0
			
			this.newShape()
			
			that = this
			
			this.initMap()
			
		    jaws.on_keydown("left",  function () { that.currentShape().moveLeft() })
		    jaws.on_keydown("right",  function () { that.currentShape().moveRight() })
		}
		
		this.currentShape = function() {
			return this.shape
		}

		this.drawPassive = function() {
			var line_height = 0

			jc.lineWidth = 0.3
			jc.strokeStyle = "white"
			
			var fillStyle = "black"
				
			for(var row = 0; row < num_rows; row++) {
				for(var col = 0; col < num_cols; col++) {
					if(this.map[row][col]) {
						fillStyle = "blue"
					} else {
						fillStyle = "black"
					}
					jaws.context.fillStyle = fillStyle
					var x = game_area_x + (col * square_side)
					var y = game_area_y + (row * square_side)
					jaws.context.fillRect(x, y, square_side, square_side)
					jaws.context.strokeRect(x, y, square_side, square_side)
				}
			}
				
//			// draw horizontal lines of grid
//			for(var i=1; i < num_rows; i++) {
//				line_height = game_area_y + (i * square_side)
//				jc.beginPath()
//				jc.moveTo(game_area_x, line_height)
//				jc.lineTo(game_area_width + game_area_x, line_height)
//				jc.stroke()
//				jc.closePath()
//			}
//			
//			// Draw vertical lines of grid
//			for(var i=1; i < num_cols; i++) {
//				line_width = game_area_x + (i * square_side)
//				jc.beginPath()
//				jc.moveTo(line_width, game_area_y)
//				jc.lineTo(line_width, game_area_y + game_area_height)
//				jc.stroke()
//			}
		}
		
		this.draw = function() {
			// Clear screen
			jaws.context.fillStyle = "black"
			jaws.context.fillRect(0,0,jaws.width,jaws.height)
			
			// Draw game area
			jaws.context.strokeStyle = "white"
			jaws.context.lineWidth = 1
			jaws.context.strokeRect(game_area_x, game_area_y, game_area_width, game_area_height)

			this.drawPassive()
			
			// Draw the current shape
			if(this.currentShape()) {
				this.currentShape().draw()
			}
		}
		
		this.initMap = function() {
			for(var r=0; r < num_rows; r++) {
				this.map.push([])
				for(var c=0; c < num_cols; c++) {
					this.map[r].push(0)
				}
			}
		}
		
		this.newShape = function() {
			var init_col = parseInt(num_cols / 2)
			this.shape = new Shape(0, init_col)
			this.is_piece_moving = true
		}
		
		this.update = function() {
			this.cycle_ticks++
			if(this.cycle_ticks >= ticks_per_cycle) {
				this.cycle_ticks = 0
				this.updateTick()
			}
		}
		
		this.updateTick = function() {
			if(this.shape && this.shape.hitBottom(this.map)) {
				this.is_piece_moving = false
				var piece = this.currentShape()
				this.map[piece.row][piece.col] = 1
				this.newShape()
			} else {
				if(this.is_piece_moving) {
					this.shape.moveDown(this.map)
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