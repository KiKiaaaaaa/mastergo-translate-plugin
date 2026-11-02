console.log("🚀 [步骤1] MasterGo 主逻辑已完全重新加载");

mg.showUI(__html__, { width: 320, height: 260 });

mg.ui.onmessage = async (rawMsg) => {
  // 💡 核心修复：剥开外层的 pluginMessage 包装
  const msg = rawMsg.pluginMessage || rawMsg;

  // 🚨 全局拦截雷达：不管收到什么，先打印出来证明“耳朵没聋”
  console.log("🚨 [主逻辑雷达] 听到了 UI 传来的消息 (已解包):", msg);

  // 1. 点击翻译按钮时触发
  if (msg && msg.type === 'start-translation') {
    console.log("📥 [步骤2] UI通知主逻辑：开始提取文本...");
    const selection = mg.document.currentPage.selection;
    console.log("🎯 当前选中的所有节点数量:", selection.length);

    const textNodes = selection.filter(node => node.type === 'TEXT');
    console.log("🎯 其中的纯文本节点数量:", textNodes.length);

    if (textNodes.length === 0) {
      mg.notify('⚠️ 请先在画布上选中至少一个文字图层！');
      console.log("❌ 拦截：没有选中文字");
      return;
    }

    mg.notify(`⏳ 正在发送请求给大模型...`);

    for (const node of textNodes) {
      console.log(`📤 [步骤3] 提取文字成功，发给UI去请求接口:`, node.characters);
      mg.ui.postMessage({
        type: 'do-fetch-translation',
        text: node.characters,
        targetLang: msg.targetLang,
        nodeId: node.id
      });
    }
  }

  // 2. 接口请求成功，拿到了翻译结果
  if (msg && msg.type === 'translation-success') {
    console.log("✅ [步骤6] 收到UI传回来的翻译结果:", msg.translatedText);
    
    // 💡 修复：正确的 API 是 mg.getNodeById，去掉了错误的 .document
    const node = mg.getNodeById(msg.nodeId);
    
    if (node && node.type === 'TEXT') {
      try {
        console.log("⏳ [步骤7] 正在加载 MasterGo 画板字体以替换文字...", node.fontName);
        await mg.loadFontAsync(node.fontName);
        node.characters = msg.translatedText;
        console.log("🎉 [步骤8] 文字替换成功！流程结束！");
        mg.notify('✅ 翻译完成！');
      } catch (error) {
        console.error("❌ 字体加载失败:", error);
        mg.notify('❌ 字体加载失败，请确认为默认字体');
      }
    }
  }

  // 3. 接口报错
  if (msg && msg.type === 'translation-error') {
    console.error("❌ 接口请求中断:", msg.error);
    mg.notify(msg.error);
  }
};