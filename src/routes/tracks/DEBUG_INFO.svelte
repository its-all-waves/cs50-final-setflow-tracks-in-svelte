<script>
	import {
		state,
		characterInHand,
		selectedCharacters,
		selectedDropZones,
		selectedHeader,
		characters,
		tracks,
		scenes,
		trackCount,
		sceneCount
	} from './machine'

	import { userStore } from '../firebase_stores'
</script>

<div class="info">
	<!-- <p
		id="feedback"
		class:invisible
	>
		{$feedback}
	</p> -->

	<!-- DATABASE -->
	<p>$userStore:</p>
	<ul>
		{#each Object.entries($userStore) as [k, v]}
			<li>{k}: {v}</li>
		{/each}
	</ul>

	<p>$trackCount: {$trackCount}</p>
	<p>$sceneCount: {$sceneCount}</p>

	<!-- LOCAL DATA -->
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

		{#each Object.values($scenes) as { name: sceneName, number, trackList }}
			<li>
				number: {number}, name: {sceneName}:
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
