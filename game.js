
	square_side = 20
	square_color = "green"
	game_area_height = square_side * 20
	game_area_width = square_side * 10
	game_area_x = 50
	game_area_y = 20
	ticks_per_cycle = 25
	
	function Shape(x, y) {
		this.x = game_area_x + x
		this.y = game_area_y + y
		
		this.draw = function() {
			jaws.context.strokeStyle = "black"
			jaws.context.fillStyle = square_color
			jaws.context.lineWidth = 3
			jaws.context.strokeRect(this.x, this.y, square_side, square_side)
			jaws.context.fillRect(this.x, this.y, square_side, square_side)
		}
		
		this.moveDown = function() {
			this.y += square_side
		}
		
		this.moveRight = function() {
			this.x += square_side
		}
		
		this.moveLeft = function() {
			this.x -= square_side
		}
		
		this.hitBottom = function() {
			if(this.y > game_area_height - square_side) {
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
			
			this.shape = new Shape(40, 40)
			
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

			jc.lineWidth = 1
			jc.strokeStyle = "white"
			
			// draw horizontal lines of grid
			for(var i=1; i < 20; i++) {
				line_height = game_area_y + (i * square_side)
				jc.beginPath()
				jc.moveTo(game_area_x, line_height)
				jc.lineTo(game_area_width + game_area_x, line_height)
				jc.stroke()
				jc.closePath()
			}
			
			// Draw vertical lines of grid
			for(var i=1; i < 10; i++) {
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