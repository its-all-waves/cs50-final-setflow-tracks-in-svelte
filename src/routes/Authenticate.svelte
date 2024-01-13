<script>
	import { authHandlers } from './firebase_stores.js'

	let email = ''
	let password = ''
	let confirmPass = ''
	let register = false
	let authenticating = false
	let error = false
	let errorMessage = ''

	async function handleAuthenticate() {
		if (authenticating) return

		if (!email || !password || (register && !confirmPass)) {
			error = true
			return
		}

		error = false
		errorMessage = ''
		authenticating = true

		try {
			!register
				? await authHandlers.login(email, password)
				: await authHandlers.signup(email, password)
		} catch (err) {
			error = true

			switch (err.code) {
				case 'auth/invalid-email':
					errorMessage = 'A valid email address is required.'
					break
				case 'auth/invalid-credential':
					errorMessage = 'Invalid email or password.'
					break
				case 'auth/too-many-requests':
					errorMessage = 'Too many failed attempts. Reset password or try again later.'
					break
				default:
					errorMessage = 'An unknown error ocurred.'
			}

			console.log('There was an auth error:', err.code)
			authenticating = false
		}
	}

	function handleRegister() {
		register = !register
	}
</script>

<div class="authContainer">
	<form>
		<h1>{register ? 'Register' : 'Login'}</h1>

		{#if error}
			<p class="error">{errorMessage}</p>
		{/if}

		<label>
			<p class={email ? ' above' : ' center'}>Email</p>
			<input
				type="email"
				placeholder="Email"
				bind:value={email}
			/>
		</label>

		<label>
			<p class={password ? ' above' : ' center'}>Password</p>
			<input
				type="password"
				placeholder="Password"
				bind:value={password}
			/>
		</label>

		{#if register}
			<label>
				<p class={confirmPass ? ' above' : ' center'}>Confirm Password</p>
				<input
					type="password"
					placeholder="Confirm Password"
					bind:value={confirmPass}
				/>
			</label>
		{/if}

		<button
			on:click={handleAuthenticate}
			type="submit">Submit</button
		>
	</form>

	<div class="options">
		{#if register}
			<div>
				<p>Already have an account?</p>
				<button on:click={handleRegister}>Login</button>
			</div>
		{:else}
			<div>
				<p>Don't have an account?</p>
				<button on:click={handleRegister}>Register</button>
			</div>
		{/if}
	</div>
</div>

<style>
	.authContainer {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		flex: 1;
		padding: 24px;
	}

	form {
		display: flex;
		flex-direction: column;
		gap: 14px;
		width: 400px;
		max-width: 100%;
		margin: 0 auto;
	}

	form label {
		position: relative;
		border: 1px solid navy;
		border-radius: 5px;
	}

	form input {
		width: 100%;
		border: none;
		background: transparent;
		color: white;
		padding: 14px;
	}

	form input:focus {
		outline: none;
	}

	form label:focus-within {
		border-color: blue;
	}

	h1 {
		text-align: center;
		font-size: 3rem;
	}

	form button {
		background: navy;
		color: white;
		border: none;
		padding: 14px 0px;
		border-radius: 5px;
		cursor: pointer;
	}

	form button:hover {
		background: blue;
	}

	.above,
	.center {
		position: absolute;
		transform: translateY(-50%);
		pointer-events: none;
		color: white;
		border-radius: 4px;
		padding: 0 6px;
		font-size: 0.8rem;
	}

	.above {
		top: 0;
		left: 24px;
		background: navy;
		border: 1px solid blue;
		font-size: 0.7rem;
	}

	.center {
		top: 50%;
		left: 6px;
		border: 1px solid transparent;
		opacity: 0;
	}

	.error {
		color: coral;
		font-size: 0.9rem;
		text-align: center;
	}

	.options {
		padding: 14px 0;
		text-align: center;
		font-size: 0.8rem;
		/* overflow: hidden; */
	}

	.options button {
		background: none;
		border: none;
		color: cyan;
		cursor: pointer;
	}

	/* .options > p {
		position: relative;
		width: fit-content;
		margin: 0 auto;
	} */

	/* .options > p::after,
	.options > p::before {
		content: '';
		positon: absolute;
		top: 50%;
		transform: translateY(-50%);
		width: 100%;
		height: 10px;
		background: white;
	} */

	/* .options > p::after {
		right: 100%;
	} */
</style>
