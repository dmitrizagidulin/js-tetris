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
		jaws.start(MenuState)
	}