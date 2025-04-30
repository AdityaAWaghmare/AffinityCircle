import React, { useState } from 'react';
import styles from './IntroPage.module.css';
import OnboardingPage from './OnboardingPage';
import '../global.css';

const screens = [
  {
    title: "Your squad, Your way",
    text: "Find friendships that resonate with your vibe and interests.",
    buttonText: "→",
  },
  {
    title: "Express Yourself",
    text: "Make your profile pop with funky avatars, a pop of color and a snazzy bio.",
    buttonText: "→"
  },
  {
    title: "Start Epic Conversations",
    text: "Mingle, connect, and grow your circle - it's all about the social adventure!",
    buttonText: "Get started →"
  }
];

const IntroPage = () => {
  const [index, setIndex] = useState(0);

  const next = () => {
    setIndex(index + 1);
  };

  const backgroundColors = ['#023449', '#033449', '#043449'];
  const textColors = ['#C69000', '#C69000', '#C69000'];

  return (
    index < screens.length ?(
      <div
        className={styles.container}
        style={{
          backgroundColor: backgroundColors[index],
          color: textColors[index]
        }}
      >

        <div>
          <h2 className={styles.title}>{screens[index].title}</h2>
          <p>{screens[index].text}</p>
        </div>

        <button onClick={next} className={styles.button}>
          {screens[index].buttonText}
        </button>

        <div className={styles.dots}>
          {screens.map((screen, i) => (
            <span
              key={`dot-${i}`}
              className={`${styles.dot} ${i === index ? styles.dotActive : ''}`}
            />
          ))}
        </div>
      </div>
    ) : (
      < OnboardingPage />
    )
  );
};

export default IntroPage;