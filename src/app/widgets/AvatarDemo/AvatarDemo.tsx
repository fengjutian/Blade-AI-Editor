import * as React from "react";
import { Avatar } from "radix-ui";
import styles from "./styles.module.css";

const AvatarDemo = () => (
	<div style={{ display: "flex", gap: 20, marginTop: 20 }}>
		<Avatar.Root className={styles.Root}>
			<Avatar.Image
				className={styles.Image}
				src="/imgs/people.jpg"
				alt="Pedro Duarte"
			/>
			<Avatar.Fallback className={styles.Fallback} delayMs={600}>
				JD
			</Avatar.Fallback>
		</Avatar.Root>
	</div>
);

export default AvatarDemo;
