<script>
	import {
		state,
		characterInHand,
		selectedCharacters,
		selectedDropZones,
		selectedHeader,
		characters,
		tracks,
		scenes
	} from './machine'
</script>

<div class="info">
	<!-- <p
		id="feedback"
		class:invisible
	>
		{$feedback}
	</p> -->

	<p>state: <span class="highlight">{$state}</span></p>
	<p>
		character in hand: <span class="highlight">{$characters[$characterInHand]?.name ?? ''}</span
		>
	</p>
	<p>
		selected header: <span class="highlight">
			{($selectedHeader?.startsWith('scn_')
				? $scenes[$selectedHeader]?.name
				: $tracks[$selectedHeader]?.name) ?? ''}
		</span>
	</p>
	<ul id="selectedCharacters">
		<span>selected characters:</span>
		{#each $selectedCharacters as { id: charId, sceneId }}
			<li>
				<span class="highlight">
					{$characters[charId].name} @ {$scenes[sceneId].name}
				</span>
			</li>
		{/each}
	</ul>
	<ul id="selectedDropZones">
		<span>selectedDropZones:</span>
		{#each $selectedDropZones as { sceneId, trackId }}
			<li>
				<span class="highlight">
					{$scenes[sceneId].name}, {$tracks[trackId].name}
				</span>
			</li>
		{/each}
	</ul>
	<ul id="scenes">
		<span>Scenes</span>

		{#each Object.values($scenes) as { name: sceneName, trackList }}
			<li>
				{sceneName}:
				{#each Object.entries(trackList) as [trackId, chars]}
					{@const { name: trackName } = $tracks[trackId]}
					<span>{trackName}:</span>
					{#each chars as charId}
						<span class="highlight">{$characters[charId].name}</span>, &MediumSpace;
					{/each}
				{/each}
			</li>
		{/each}
	</ul>
	<ul id="characters">
		<span>Characters:</span>
		{#each Object.values($characters) as { name }}
			<span class="highlight">{name}</span>, &MediumSpace;
		{/each}
	</ul>
	<ul id="tracks">
		<span>Tracks:</span>
		{#each Object.values($tracks) as { name }}
			<span class="highlight">{name}</span>, &MediumSpace;
		{/each}
	</ul>
	<!-- <ul>
		<span>Scenes:</span>
		{#each Object.keys($scenes) as scene}
			<span>{scene}, &MediumSpace;</span>
		{/each}
	</ul> -->
</div>

<style>
	.info {
		border: 1px solid white;
		padding: 0.5rem;
		line-height: 1rem;
	}

	.highlight {
		color: goldenrod;
	}

	ul {
		padding-left: 0;
	}

	ul,
	li,
	p {
		margin: 0;
	}

	li {
		padding-left: 1rem;
		list-style-type: none;
	}
</style>
