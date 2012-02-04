/*
*
* GameState is the actual game play. We switch to it once user choses "Start game"
*
*/
//	var fps = document.getElementById("test")
		
/**
 * Utility function to draw text
 * @param fontSize
 * @param fillColor
 * @param text
 * @param x
 * @param y
 */
	function drawText(fontSize, fillColor, text, x, y) {
		jaws.context.font = "bold "+fontSize+"pt courier";
		jaws.context.lineWidth = 10
		jaws.context.fillStyle =  fillColor
		jaws.context.strokeStyle =  "rgba(200, 200, 200, 0.0)"
		jaws.context.fillText(text, x, y)
	}

	function GameState() {
		var square_side = 20
		var square_color = "green"
		var jc = jaws.context
			
		this.setup = function() {
		}
		
		this.draw = function() {
			jaws.clear()
			
//			jc.lineWidth = 2
//			jc.strokeStyle = "black"
//			jc.beginPath()
//			jc.moveTo(10,10)
//			jc.lineTo(10, 20)
//			jc.closePath()
//			jc.stroke()
			
			// Clear screen
			jaws.context.fillStyle = "black"
			jaws.context.fillRect(0,0,jaws.width,jaws.height)
			
			// Draw game area
			jaws.context.strokeStyle = "white"
			jaws.context.lineWidth = 1
			var game_area_height = square_side * 20
			var game_area_width = square_side * 10
			var game_area_x = 50
			var game_area_y = 20
			jaws.context.strokeRect(game_area_x, game_area_y, game_area_width, game_area_height)

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
			
			// Ok, let's draw one rectangle
			jaws.context.strokeStyle = "black"
			jaws.context.fillStyle = square_color
			jaws.context.lineWidth = 3
			var x = game_area_x + 40
			var y = game_area_y + 40
			jaws.context.strokeRect(x, y, square_side, square_side)
			jaws.context.fillRect(x, y, square_side, square_side)
		}
		
		this.update = function() {
			
		}
	}
	
/*
*
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
 
	
/*
*
* Our script-entry point
*
*/
	window.onload = function() {
		jaws.start(GameState)
	}