<form class="inputs">
	<div class="track-input">
		<input
			autofocus
			name="track-prefix"
			type="text"
			class=""
			value={trackPrefix}
			on:keydown={submitTracks}
		/>
		<span> X </span>
		<input
			name="track-count"
			type="text"
			class=""
			value={trackCount}
			on:keydown={submitTracks}
		/>
	</div>

	<div class="scene-input">
		<input
			name="scene-name"
			type="text"
			class=""
			placeholder="add a scene"
			on:keydown={submitScene}
		/>
	</div>

	<div class="actor-input">
		<input
			name="actor-name"
			type="text"
			class=""
			placeholder="add a character"
			on:keydown={submitCharacter}
		/>
	</div>
</form>
