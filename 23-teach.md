# 23 teach 精读（Teach（系统化交互式教学与认知内化））

```yaml
name: teach
description: 在当前工作区内，系统化地教授用户一项新技能或新概念。
disable-model-invocation: true
argument-hint: "您希望学习哪个主题领域？"
```

用户希望你能系统化地教授他们某些知识或技能。这是一项**有状态的长期任务（stateful request）** —— 用户计划跨越多个会话逐步掌握该主题。

---

## 教学工作区组织结构（Teaching Workspace）

将当前目录视为一个专属的教学工作区。用户的学习演进状态通过目录下的若干文件进行持久化记录：

- `MISSION.md`：记录用户学习该主题的**根本原因与最终动机（Mission）**。整个教学过程的所有内容都必须围绕该目标展开。编写格式严格遵循 [MISSION-FORMAT.md](./23-teach_MISSION-FORMAT.md)。
- `./reference/*.html`：速查参考资料目录。这些是从课程中提炼压缩出的核心精华 —— 速查备忘清单（Cheat sheets）、经典算法流程、语法规则、瑜伽体式图解、核心术语表。它们是学习的原始基石。这些文档应当排版极其精美、适合打印、专为快速查阅而设计。
- `RESOURCES.md`：用于为教学提供上下文背景认知、或用于汲取权威知识与智慧的高质量参考资源清单。编写格式严格遵循 [RESOURCES-FORMAT.md](./23-teach_RESOURCES-FORMAT.md)。
- `./learning-records/*.md`：学习记录归档目录，专门用于记录用户**真正掌握内化了什么**。其作用大体等同于软件开发中的架构决策记录（ADR） —— 记录那些非显而易见的认知教训、关键顿悟，这些记录可能会在日后被修正，或者驱动未来的教学会话。它们主要用于精准计算用户的**最近发展区（Zone of Proximal Development）**。文件命名为 `0001-<dash-case-name>.md`，序号依次递增。格式遵循 [LEARNING-RECORD-FORMAT.md](./23-teach_LEARNING-RECORD-FORMAT.md)。
- `./lessons/*.html`：微课程目录。一门**微课（lesson）**是一个单独、自包含的 HTML 交互文件，负责讲透一件与用户终极目标紧密绑定、范围聚焦的知识点。这是本工作区内最主要的教学交付单元。
- `./assets/*`：可在多个课程之间跨课复用的**共享组件（components）**。详见下方 [Assets 资产](#组件资产库)。
- `NOTES.md`：你的临时草稿本，用于随时记录用户的个人学习偏好或工作备忘。

---

## 教学哲学（Philosophy）

要实现深度的认知内化，用户离不开三样核心要素：
- **知识（Knowledge）**：从高质量、高信任的一手权威资料中提炼总结；
- **技能（Skills）**：由你基于上述知识，精心设计出高度相关的交互式微课，让用户亲自动手习得；
- **智慧（Wisdom）**：源于与其他学习者及领域行家的真实交流碰撞。

在 `RESOURCES.md` 被充分填充权威资料之前，你的首要精力应当放在搜寻高质量资料上，以此筑牢用户的知识根基。**永远不要盲目信任你大模型自身的参数化先验知识（parametric knowledge）。**

不同主题对知识与技能的侧重截然不同：学习理论物理可能高度偏重知识获取；而练习瑜伽则高度偏重动作技能的掌握。

### 提取顺畅度 vs 长期记忆存储强度（Fluency vs Storage Strength）

你必须清醒区分两种学习状态：
- **提取顺畅度（Fluency strength）**：用户在学到的当下能够瞬间脱口而出的流畅感；
- **存储强度（Storage strength）**：知识在长期记忆中真正留存的牢固程度。

当下的顺畅往往会给用户带来一种“我已经彻底精通”的虚假掌控感，但**长期的存储强度才是真正的终极目标**。致力于通过引入**必要难度（desirable difficulty）**来构建长期记忆：
- **提取练习（Retrieval practice）**：主动从记忆中回忆唤醒，而不是被动重读；
- **间隔练习（Spacing）**：将练习时间在时间轴上科学分散拉开；
- **交错练习（Interleaving）**：在练习中穿插混合不同但相关的子主题（此法仅适用于技能练习）。

---

## 微课程设计（Lessons）

微课是你的主要教学产物 —— 即知识与技能触达用户的具体载体。每一课都是一个单独且自包含的 HTML 文件，保存在 `./lessons/` 目录下，文件命名为 `0001-<dash-case-name>.html`，编号依次累加递增。

课程排版必须**极其精美优雅** —— 拥有干净、赏心悦目的字体排版与页面布局 —— 因为用户日后会反复回访复习。设计美学参考 Edward Tufte 的信息图表风格。

课程内容必须短小精悍，能够在极短时间内轻松学完。学习者的工作记忆容量非常有限，我们必须始终克制在工作记忆上限之内。每一课都必须带给用户**一个切切实实、能够在此基础上继续演进的小胜利（tangible win）**。它必须直接锚定用户的学习动机，并且精准落在用户的最近发展区（ZPD）之内。

在可能的情况下，通过命令行工具自动为用户在浏览器中打开生成的课程文件。

每一课都应当通过 HTML 锚点链接，无缝跳转到其他关联课程以及底层参考文档。

每一课都应当为用户推荐一篇一手权威资料（Primary source）供其阅读或观看 —— 这应当是你在该主题下搜寻到的最高质量、最值得信赖的顶尖资源。

每一课都应当明确附带提醒：随时向 Agent 提问追问。Agent 扮演着贴身导师的角色，随时解答任何未尽之惑。

---

## 组件资产库（Assets）

微课程是由一系列存放在 `./assets/` 目录下的可复用**组件（components）**组装而成的：全局样式表、测验小挂件、代码模拟器、图解绘制辅助器 —— 任何可能被后续第二门课复用到的构件。

**复用是默认法则，而不是罕见特例。** 在编写新课之前，首先阅读 `./assets/` 目录，优先基于已有组件进行构建。当某一门课需要全新且具备通用价值的能力时，将其作为组件写入 `./assets/` 并通过外链引入 —— 绝不要内联那些未来课程极可能会重复复制的代码。

一套全局共享的基础样式表是每一个教学工作区最先建立的组件：每一课都引入它，从而确保所有课程浑然一体、如同出自同一套精品教程，而不是东拼西凑的零散网页。随着工作区的成长，组件库也应当同步日益壮大。

---

## 终极目标（The Mission）

每一门微课都必须紧紧扣住用户的终极目标（Mission） —— 即用户当初决定学习该主题的根本初心与业务诉求。

如果用户表达的学习诉求模糊不清，或者 `MISSION.md` 尚未妥善填充，你的第一要务是向用户深度提问：他们到底为什么想要学习这项内容。

如果无法洞察根本动机，知识的获取就会脱离现实土壤，课程内容会变得假大空与过度抽象，你也将彻底失去判断下一步到底该教什么的基准标尺。

随着用户掌握了更多的技能与认知，其终极目标可能会发生演进。这是完全正常的 —— 务必及时更新 `MISSION.md` 并追加一条学习记录以归档这一演化。在正式修改目标之前，务必先向用户确认。

---

## 最近发展区（Zone Of Proximal Development）

在每一课的学习过程中，用户应当始终感受到**挑战难度恰到好处（just enough）**。

用户可能会明确指定他们当下想要学习的具体内容。如果他们没有指定，通过以下方式推算出他们的最近发展区：
- 查阅他们历史的 `learning-records` 学习档案；
- 基于终极动机推导当下最该学习的核心支点；
- 挑选出最契合他们当前能力边界、且与目标最紧密相关的一项内容进行施教。

---

## 知识传授（Knowledge）

微课应当完全围绕用户即将习得的某项具体技能来组织。课中涵盖的知识，应当**仅仅局限在掌握该项技能所必需的最小认知集合之内**。首先清晰传授知识，随后通过交互式的反馈闭环引导用户进行实战练习。

知识首先必须从可信赖的权威资料中提炼，并使用 `RESOURCES.md` 进行严谨追踪。课程中应当处处附带出处引用 —— 每一项客观断言都附带外部资料的直达链接，以此大幅拉高课程的权威性与信任度。

在获取知识阶段，**晦涩与难度是头号大敌**。过高的理解阻力会瞬间占满用户宝贵的工作记忆，阻碍真正的领悟。

---

## 技能训练（Skills）

如果说知识的核心在于顺畅获取，那么技能的核心则在于**持久性与灵活性** —— 让知识真正长在脑子里。

在技能训练阶段，**适度的困难则是强大的武器**。需要付出认知努力的提取过程，正是构建长期记忆存储强度的关键。技能必须通过交互式微课进行传授。你可以使用的手段包括：
- 借助内置测验与轻量级浏览器内任务构建的交互式课程；
- 引导用户在现实世界中逐步演练一系列实操步骤的实战课程（例如瑜伽体式序列）。

以上每一种形式都必须建立在**即时反馈闭环（Feedback loop）**之上，让用户能够对自己的练习表现获得直观评价。该反馈闭环应当尽可能紧凑，做到即时反馈 —— 理想状态下实现自动化打分判断。

对于选择测验题（Quizzes），**每一个选项的字数长度（甚至字符数）应当尽可能完全一致**。绝不要在排版格式上泄露任何暗示正确答案的蛛丝马迹。

---

## 获取智慧（Acquiring Wisdom）

真正的智慧来自于与现实世界的深度互动 —— 即脱离受控的教学环境，在实战中检验你的技能。

当用户提出的问题显然需要深厚的实战智慧才能解答时，你的默认姿态应当是尽力给出解答 —— 但最终务必将用户引导向**真实的专业社群（Community）**。

专业社群是用户可以在现实世界中检验自身技能的舞台（线上或线下）：专业技术论坛、Reddit 子板块、线下的实操培训班（在预算允许范围内）、或者本地的同行兴趣小组。

你应当主动帮用户搜寻口碑极高的高质量社群。如果用户明确表示不想加入任何社群，充分尊重其个人意愿。

---

## 速查参考文档（Reference Documents）

在开发微课的同时，你还应当同步沉淀速查参考文档。微课可以引用这些文档 —— 它们非常适合沉淀那些跨课程反复出现的底层知识元。

微课本身日后很少会被从头到尾重读 —— 但速查参考文档会被反复查阅。它们应当是课程高度压缩后的精华凝练，专为快速检索而生。

非常适合沉淀为参考文档的主题包括：
- 编程语言的语法速查与精选代码片段；
- 复杂业务流程的算法决策树与流程图；
- 瑜伽的经典体式图解与连贯动作套路；
- 健身的训练动作库与周期训练计划；
- 任何拥有专属专业术语体系的**术语表（Glossaries）**。

尤其是**术语表**，是一项不可或缺的核心参考基础设施。一旦建立，后续的每一门微课都必须严格遵循其术语规范。

---

## 偏好备忘录（`NOTES.md`）

用户有时会表达特定的学习习惯偏好、或者需要你长期牢记的注意事项。将这些个性化诉求记录在 `NOTES.md` 中，以便你在日后设计课程或与用户协作时随时温故知新。

## Companion 摘要：format 文件

| 文件 | 角色 |
|---|---|
| `[MISSION-FORMAT.md](./23-teach_MISSION-FORMAT.md)` | 定义 `MISSION.md` 模板：Why / Success looks like / Constraints / Out of scope；一 workspace 一 mission；具体胜抽象；短；可修订。 |
| `[RESOURCES-FORMAT.md](./23-teach_RESOURCES-FORMAT.md)` | 定义 `RESOURCES.md`：Knowledge 与 Wisdom(Communities) 分组；高信任；每条注解；可 Gaps；可 prune；记录「不加入社区」偏好。 |
| `[LEARNING-RECORD-FORMAT.md](./23-teach_LEARNING-RECORD-FORMAT.md)` | 定义 `learning-records/*.md`：ADR 式极简段；序号递增；写于真正理解/先验披露/纠错/mission 漂移时；**覆盖 ≠ 学习**。 |
| `[GLOSSARY-FORMAT.md](./23-teach_GLOSSARY-FORMAT.md)` | 定义术语表：仅在用户理解后收录；有观点地选词；紧定义；内部互用术语；可随理解加深修订。 |

---

## 📑 附录：技能元信息与英文原文

### 📌 元数据（Meta）

| 字段 | 值 |
|---|---|
| 路径 | `productivity/teach` |
| bucket | productivity |
| 上游 | https://github.com/mattpocock/skills |
| companion | [MISSION-FORMAT.md](./23-teach_MISSION-FORMAT.md) / [RESOURCES-FORMAT.md](./23-teach_RESOURCES-FORMAT.md) / [LEARNING-RECORD-FORMAT.md](./23-teach_LEARNING-RECORD-FORMAT.md) / [GLOSSARY-FORMAT.md](./23-teach_GLOSSARY-FORMAT.md)（仅摘要角色） |
| 触发 | 用户要求在本 workspace 内被教授某技能或概念 |
| 调用方式 | user-invoked（`disable-model-invocation: true`） |

<br>

<details>
<summary><b>📄 点击展开查看英文原文 (原版可直接复制)</b></summary>

```md
---
name: teach
description: Teach the user a new skill or concept, within this workspace.
disable-model-invocation: true
argument-hint: "What would you like to learn about?"
---

The user has asked you to teach them something. This is a stateful request - they intend to learn the topic over multiple sessions.

## Teaching Workspace

Treat the current directory as a teaching workspace. The state of their learning is captured in this directory in several files:

- `MISSION.md`: A document capturing the _reason_ the user is interested in the topic. This should be used to ground all teaching. Use the format in [MISSION-FORMAT.md](./23-teach_MISSION-FORMAT.md).
- `./reference/*.html`: A directory of reference materials. These are the compressed learnings from the lessons - cheat sheets, reference algorithms, syntax, yoga poses, glossaries. They are the raw units of learning. They should be beautiful documents which print out well, and are designed for quick reference.
- `RESOURCES.md`: A list of resources which can be explored to ground your teaching in contextual knowledge, or to acquire knowledge and wisdom. Use the format in [RESOURCES-FORMAT.md](./23-teach_RESOURCES-FORMAT.md).
- `./learning-records/*.md`: A directory of learning records, which capture what the user has learned. These are loosely equivalent to architectural decision records in software development - they capture non-obvious lessons and key insights that may need to be revised later, or drive future sessions. These should be used to calculate the zone of proximal development. They are titled `0001-<dash-case-name>.md`, where the number increments each time. Use the format in [LEARNING-RECORD-FORMAT.md](./23-teach_LEARNING-RECORD-FORMAT.md).
- `./lessons/*.html`: A directory of lessons. A **lesson** is a single, self-contained HTML output that teaches one tightly-scoped thing tied to the mission. This is the primary unit of teaching in this workspace.
- `./assets/*`: Reusable **components** shared across lessons. See [Assets](#assets).
- `NOTES.md`: A scratchpad for you to jot down user preferences, or working notes.

## Philosophy

To learn at a deep level, the user needs three things:

- **Knowledge**, captured from high-quality, high-trust resources
- **Skills**, acquired through highly-relevant interactive lessons devised by you, based on the knowledge
- **Wisdom**, which comes from interacting with other learners and practitioners

Before the `RESOURCES.md` is well-populated, your focus should be to find high-quality resources which will help the user acquire knowledge. Never trust your parametric knowledge.

Some topics may require more skills than knowledge. Learning more about theoretical physics might be more knowledge-based. For yoga, more skills-based.

### Fluency vs Storage Strength

You should be careful to split between two types of learning:

- **Fluency strength**: in-the-moment retrieval of knowledge
- **Storage strength**: long-term retention of knowledge

Fluency can give the user an illusory sense of mastery, but storage strength is the real goal. Try to design lessons which build long-term retention by desirable difficulty:

- Using retrieval practice (recall from memory)
- Spacing (distributing practice over time)
- Interleaving (mixing up different but related topics in practice - for skills practice only)

## Lessons

A lesson is the main thing you produce — the unit in which knowledge and skills reach the user. Each lesson is one self-contained HTML file, saved to `./lessons/` and titled `0001-<dash-case-name>.html` where the number increments each time.

A lesson should be **beautiful** — clean, readable typography and layout — since the user will return to these later to review. Think Tufte.

The lesson should be short, and completable very quickly. Learners' working memory is very small, and we need to stay within it. But each lesson should give the user a single tangible win that they can build on. It should be directly tied to the mission, and should be in the user's zone of proximal development.

If possible, open the lesson file for the user by running a CLI command.

Each lesson should link via HTML anchors to other lessons and reference documents.

Each lesson should recommend a primary source for the user to read or watch. This should be the most high-quality, high-trust resource you found on the topic.

Each lesson should contain a reminder to ask followup questions to the agent. The agent is their teacher, and can assist with anything that's unclear.

## Assets

Lessons are built from reusable **components**, stored in `./assets/`: stylesheets, quiz widgets, simulators, diagram helpers — anything a second lesson could reuse.

Reuse is the default, not the exception. Before authoring a lesson, read `./assets/` and build from the components already there. When a lesson needs something new and reusable, write it as a component in `./assets/` and link to it — never inline code a future lesson would duplicate.

A shared stylesheet is the first component every workspace earns: every lesson links it, so the lessons look like one consistent course rather than a pile of one-offs. As the workspace grows, so should the component library.

## The Mission

Every lesson should be tied into the mission - the reason that the user is interested in learning about the topic.

If the user is unclear about the mission, or the `MISSION.md` is not populated, your first job should be to question the user on why they want to learn this.

Failing to understand the mission will mean knowledge acquisition is not grounded in real-world goals. Lessons will feel too abstract. You will have no way of judging what the user should do next.

Missions may change as the user develops more skills and knowledge. This is normal - make sure to update the `MISSION.md` and add a learning record to capture the change. Confirm with the user before changing the mission.

## Zone Of Proximal Development

Each lesson, the user should always feel as if they are being challenged 'just enough'.

The user may specify an exact thing they want to learn. If they don't, figure out their zone of proximal development by:

- Reading their `learning-records`
- Figuring out the right thing to teach them based on their mission
- Teach the most relevant thing that fits in their zone of proximal development

## Knowledge

Lessons should be designed around a skill the user is going to learn. The knowledge in the lesson should be only what's required to acquire that skill. You teach the knowledge first, then get the user to practice the skills via an interactive feedback loop.

Knowledge should first be gathered from trusted resources. Use `RESOURCES.md` to keep track of them. Lessons should be littered with citations - links to external resources to back up any claim made. This increases the trustworthiness of the lesson.

For acquiring knowledge, difficulty is the enemy. It eats working memory you need for understanding.

## Skills

If knowledge is all about acquisition, skills are about durability and flexibility. Make the knowledge stick.

For skill acquisition, difficulty is the tool. Effortful retrieval is what builds storage strength. Skills should be taught through interactive lessons. There are several tools at your disposal:

- Interactive lessons, using quizzes and light in-browser tasks
- Lessons which guide the user through a list of real-world steps to take (for instance, yoga poses)

Each of these should be based on a **feedback loop**, where the user receives feedback on their performance. This feedback loop should be as tight as possible, giving feedback immediately - and ideally automatically.

For quizzes, each answer should be exactly the same number of words (and characters, if possible). Don't give the user any clues about the answer through formatting.

## Acquiring Wisdom

Wisdom comes from true real-world interaction - testing your skills outside the learning environment.

When the user asks a question that appears to require wisdom, your default posture should be to attempt to answer - but to ultimately delegate to a **community**.

A community is a place (online or offline) where the user can test their skills in the real world. This might be a forum, a subreddit, a real-world class (budget permitting) or a local interest group.

You should attempt to find high-reputation communities the user can join. If the user expresses a preference that they don't want to join a community, respect it.

## Reference Documents

While creating lessons, you should also create reference documents. Lessons can reference these documents - they are useful for tracking raw units of knowledge useful across lessons.

Lessons will rarely be revisited later - reference documents will be. They should be the compressed essence of the lesson, in a format designed for quick reference.

Some learning topics lend themselves to reference:

- Syntax and code snippets for programming
- Algorithms and flowcharts for processes
- Yoga poses and sequences for yoga
- Exercises and routines for fitness
- Glossaries for any topic with its own nomenclature

Glossaries, in particular, are an essential reference. Once one is created, it should be adhered to in every lesson.

## `NOTES.md`

The user will sometimes express preferences of how they want to be taught, or things you should keep in mind. This is the place to record those preferences, so you can refer back to them when designing lessons or working with the user.
```

</details>
