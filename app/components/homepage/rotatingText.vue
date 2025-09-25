<script setup lang="ts">
import { AnimatePresence, Motion, type Target, type Transition, type VariantLabels } from 'motion-v';
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';

type StaggerFrom = 'first' | 'last' | 'center' | 'random' | number;
type SplitBy = 'characters' | 'words' | 'lines';

interface WordElement {
  characters: string[];
  needsSpace: boolean;
}

interface RotatingTextProps {
  texts: string[];
  transition?: Transition;
  initial?: boolean | Target | VariantLabels;
  animate?: Target | VariantLabels;
  exit?: Target | VariantLabels;
  animatePresenceMode?: 'sync' | 'wait';
  animatePresenceInitial?: boolean;
  rotationInterval?: number; // ms desired visible time per frame
  staggerDuration?: number; // in seconds (as original prop)
  staggerFrom?: StaggerFrom;
  loop?: boolean;
  auto?: boolean;
  splitBy?: SplitBy;
  onNext?: (index: number) => void;
  mainClassName?: string;
  splitLevelClassName?: string;
  elementLevelClassName?: string;
}

const cn = (...classes: (string | undefined | null | boolean)[]): string => {
  return classes.filter(Boolean).join(' ');
};

const props = withDefaults(defineProps<RotatingTextProps>(), {
  transition: () =>
    ({
      type: 'spring',
      damping: 25,
      stiffness: 300
    }) as Transition,
  initial: () => ({ y: '100%', opacity: 0 }) as Target,
  animate: () => ({ y: 0, opacity: 1 }) as Target,
  exit: () => ({ y: '-120%', opacity: 0 }) as Target,
  animatePresenceMode: 'wait',
  animatePresenceInitial: false,
  rotationInterval: 1000, // default visible ms
  staggerDuration: 0,
  staggerFrom: 'first',
  loop: true,
  auto: true,
  splitBy: 'characters'
});

const currentTextIndex = ref(0);

/* scheduler timeout (per-frame) */
let timeoutId: ReturnType<typeof setTimeout> | null = null;

const splitIntoCharacters = (text: string): string[] => {
  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    const IntlWithSegmenter = Intl as typeof Intl & {
      Segmenter: new (
        locales?: string | string[],
        options?: { granularity: 'grapheme' | 'word' | 'sentence' }
      ) => {
        segment: (text: string) => Iterable<{ segment: string }>;
      };
    };
    const segmenter = new IntlWithSegmenter.Segmenter('en', { granularity: 'grapheme' });
    return [...segmenter.segment(text)].map(({ segment }) => segment);
  }

  return [...text];
};

/* elements always returns WordElement[] (never undefined) */
const elements = computed<WordElement[]>((): WordElement[] => {
  const currentText = props.texts?.[currentTextIndex.value] ?? '';

  const mapParts = (parts: string[]): WordElement[] =>
    parts.map((part, i) => ({
      characters: [part],
      needsSpace: i !== parts.length - 1
    }));

  switch (props.splitBy) {
    case 'characters': {
      const words = currentText.split(' ');
      return words.map((word, i) => ({
        characters: splitIntoCharacters(word),
        needsSpace: i !== words.length - 1
      }));
    }
    case 'words': {
      const words = currentText.split(' ');
      return words.map((word, i) => ({
        characters: [word],
        needsSpace: i !== words.length - 1
      }));
    }
    case 'lines': {
      const lines = currentText.split('\n');
      return lines.map((line, i) => ({
        characters: [line],
        needsSpace: i !== lines.length - 1
      }));
    }
    default: {
      const delim = (props.splitBy as unknown) as string;
      const parts = delim ? currentText.split(delim) : [currentText];
      return mapParts(parts);
    }
  }
});

/* stagger delay calculator */
const getStaggerDelay = (index: number, totalChars: number): number => {
  const { staggerDuration, staggerFrom } = props;

  switch (staggerFrom) {
    case 'first':
      return index * staggerDuration!;
    case 'last':
      return (totalChars - 1 - index) * staggerDuration!;
    case 'center': {
      const center = Math.floor(totalChars / 2);
      return Math.abs(center - index) * staggerDuration!;
    }
    case 'random': {
      const randomIndex = Math.floor(Math.random() * totalChars);
      return Math.abs(randomIndex - index) * staggerDuration!;
    }
    default:
      return Math.abs((staggerFrom as number) - index) * staggerDuration!;
  }
};

/* compute ms used by transition (if provided). If transition.duration looks like seconds (<=10), treat as seconds. */
const getAnimationMs = (): number => {
  const t = props.transition as unknown as { duration?: number } | undefined;
  if (t && typeof (t as unknown).duration === 'number') {
    const dur = (t as unknown).duration;
    // if likely specified in seconds (< 10), convert to ms; otherwise assume ms
    return dur <= 10 ? dur * 1000 : dur;
  }
  // fallback
  return 200;
};

/* compute per-frame delay to wait before advancing to the next item (in ms) */
const computeDelayForCurrent = (index: number): number => {
  const baseVisibleMs = props.rotationInterval ?? 1000;
  // total chars in current frame
  const totalChars = elements.value.reduce((sum, w) => sum + w.characters.length, 0);
  // per char stagger is in seconds as prop; convert to ms
  const perCharMs = (props.staggerDuration ?? 0) * 1000;
  const totalStaggerMs = Math.max(0, (totalChars - 1) * perCharMs);
  const animationMs = getAnimationMs();

  // total = visible + longest stagger + animation padding
  return Math.ceil(baseVisibleMs + totalStaggerMs + animationMs);
};

/* scheduler helpers */
const cleanupInterval = (): void => {
  if (timeoutId) {
    clearTimeout(timeoutId);
    timeoutId = null;
  }
};

const scheduleNext = (): void => {
  cleanupInterval();
  if (!props.auto) return;

  const atLast = currentTextIndex.value === props.texts.length - 1;
  if (atLast && !props.loop) return;

  const delay = computeDelayForCurrent(currentTextIndex.value);
  timeoutId = setTimeout(() => {
    next();
    // schedule again for the new current
    scheduleNext();
  }, delay);
};

/* navigation helpers (ensure schedule restarts after manual change) */
const handleIndexChange = (newIndex: number): void => {
  currentTextIndex.value = newIndex;
  props.onNext?.(newIndex);
  scheduleNext();
};

const next = (): void => {
  const isAtEnd = currentTextIndex.value === props.texts.length - 1;
  const nextIndex = isAtEnd ? (props.loop ? 0 : currentTextIndex.value) : currentTextIndex.value + 1;

  if (nextIndex !== currentTextIndex.value) {
    handleIndexChange(nextIndex);
  } else {
    scheduleNext();
  }
};

const previous = (): void => {
  const isAtStart = currentTextIndex.value === 0;
  const prevIndex = isAtStart ? (props.loop ? props.texts.length - 1 : currentTextIndex.value) : currentTextIndex.value - 1;

  if (prevIndex !== currentTextIndex.value) {
    handleIndexChange(prevIndex);
  } else {
    scheduleNext();
  }
};

const jumpTo = (index: number): void => {
  const validIndex = Math.max(0, Math.min(index, props.texts.length - 1));
  if (validIndex !== currentTextIndex.value) {
    handleIndexChange(validIndex);
  } else {
    scheduleNext();
  }
};

const reset = (): void => {
  if (currentTextIndex.value !== 0) {
    handleIndexChange(0);
  } else {
    scheduleNext();
  }
};

defineExpose({
  next,
  previous,
  jumpTo,
  reset
});

/* restart scheduling when relevant props change */
watch(
  () => [props.auto, props.rotationInterval, props.staggerDuration, props.staggerFrom, props.transition, props.loop] as const,
  () => {
    cleanupInterval();
    scheduleNext();
  },
  { immediate: true }
);

onMounted(() => {
  scheduleNext();
});

onUnmounted(() => {
  cleanupInterval();
});
</script>

<template>
  <Motion
    tag="span"
    :class="cn('flex flex-wrap  relative', props.mainClassName)"
    v-bind="$attrs"
    :transition="props.transition"
    layout
  >
    <span class="sr-only">
      {{ props.texts[currentTextIndex] }}
    </span>

    <AnimatePresence :mode="props.animatePresenceMode" :initial="props.animatePresenceInitial">
      <Motion
        :key="currentTextIndex"
        tag="span"
        :class="cn(props.splitBy === 'lines' ? 'flex flex-col w-full' : 'flex flex-wrap  relative')"
        aria-hidden="true"
        layout
      >
        <span v-for="(wordObj, wordIndex) in elements" :key="wordIndex" :class="cn('inline-flex', props.splitLevelClassName)">
          <Motion
            v-for="(char, charIndex) in wordObj.characters"
            :key="charIndex"
            tag="span"
            :initial="props.initial"
            :animate="props.animate"
            :exit="props.exit"
            :transition="{
              ...props.transition,
              delay: getStaggerDelay(
                elements.slice(0, wordIndex).reduce((sum, word) => sum + word.characters.length, 0) + charIndex,
                elements.reduce((sum, word) => sum + word.characters.length, 0)
              )
            }"
            :class="cn('inline-block', props.elementLevelClassName)"
          >
            {{ char }}
          </Motion>
          <span v-if="wordObj.needsSpace" class="whitespace-pre"></span>
        </span>
      </Motion>
    </AnimatePresence>
  </Motion>
</template>
