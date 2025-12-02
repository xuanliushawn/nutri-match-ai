import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      // Hero Section
      "hero.title": "Discover Your Perfect Supplements",
      "hero.subtitle": "AI-powered personalized health supplement recommendations backed by real scientific research",
      "hero.cta": "Get Started",
      
      // Questionnaire
      "questionnaire.title": "Tell Us About Yourself",
      "questionnaire.age": "Age",
      "questionnaire.gender": "Gender",
      "questionnaire.male": "Male",
      "questionnaire.female": "Female",
      "questionnaire.other": "Other",
      "questionnaire.healthGoals": "Health Goals",
      "questionnaire.healthGoals.placeholder": "e.g., Improve sleep, boost energy, reduce stress",
      "questionnaire.allergies": "Allergies or Restrictions",
      "questionnaire.allergies.placeholder": "e.g., Lactose intolerant, vegan, gluten-free",
      "questionnaire.medications": "Current Medications",
      "questionnaire.medications.placeholder": "e.g., Blood pressure medication, insulin",
      "questionnaire.submit": "Get My Recommendations",
      
      // Results
      "results.title": "Your Personalized Supplement Plan",
      "results.analyzing": "Analyzing your health profile...",
      "results.searching": "Searching scientific research...",
      
      // Supplement Card
      "supplement.dosage": "Recommended Dosage",
      "supplement.benefits": "Key Benefits",
      "supplement.research": "Scientific Research",
      "supplement.verified": "PubMed Verified",
      "supplement.timing": "Best Time to Take",
      "supplement.sideEffects": "Possible Side Effects",
      
      // Interaction Checker
      "interactions.title": "Supplement Interactions",
      "interactions.medications": "Your Current Medications",
      "interactions.add": "Add Medication",
      "interactions.severity.high": "High",
      "interactions.severity.moderate": "Moderate",
      "interactions.severity.low": "Low",
      "interactions.noInteractions": "No known interactions detected",
      
      // Progress Tracker
      "progress.title": "Progress Tracker",
      "progress.rating": "How do you feel today?",
      "progress.notes": "Notes & Observations",
      "progress.addEntry": "Log Entry",
      "progress.stats": "Statistics",
      "progress.daysTracked": "Days Tracked",
      "progress.avgRating": "Average Rating",
      "progress.goodDays": "Good Days",
      "progress.history": "Progress History",
      
      // Price Comparison
      "price.title": "Price Comparison",
      "price.bestPrice": "Best Price",
      "price.viewDeal": "View Deal",
      "price.shipping": "Shipping",
      "price.outOfStock": "Out of Stock",
      
      // Onboarding
      "onboarding.skip": "Skip tutorial",
      "onboarding.next": "Next",
      "onboarding.back": "Back",
      "onboarding.getStarted": "Get Started",
      
      // Common
      "common.loading": "Loading...",
      "common.error": "Something went wrong",
      "common.retry": "Retry",
      "common.save": "Save",
      "common.cancel": "Cancel",
      
      // Supplement Card
      "card.whyGoodForYou": "Why This Is Good For You",
      "card.recommendedDose": "Recommended Dose",
      "card.userSentiment": "User Sentiment",
      "card.positive": "Positive",
      "card.basedOn": "Based on",
      "card.reviews": "social media reviews",
      "card.keyBenefits": "Key Benefits",
      "card.activeIngredients": "Active Ingredients",
      "card.safetyConsiderations": "Safety Considerations",
      "card.scientificEvidence": "Scientific Evidence",
      "card.pubmedVerified": "PubMed Verified",
      "card.readFullStudy": "Read Full Study",
      "card.papersVerified": "Papers verified from PubMed scientific database",
      "card.trendingOnSocial": "Trending on Social Media",
      "card.posts": "posts",
      "card.viewDetails": "View Details",
      "card.strongEvidence": "Strong Evidence",
      "card.moderateEvidence": "Moderate Evidence",
      "card.limitedEvidence": "Limited Evidence",
      "card.insufficientEvidence": "Insufficient Evidence",
      
      // Results Section
      "results.topMatchesFor": "Top Matches for:",
      "results.basedOnAnalysis": "Based on AI analysis of 12,000+ social media reviews and 250+ scientific papers",
      "results.medicalDisclaimer": "Medical Disclaimer:",
      "results.disclaimerText": "This information is for educational purposes only and not medical advice. Always consult with a healthcare provider before starting any supplement regimen, especially if you have existing health conditions or take medications. Supplements are not FDA-approved to treat, cure, or prevent disease.",
      "results.analyzingReviews": "Analyzing thousands of reviews and scientific papers...",
      "results.errorText": "Error:",
      "results.tryAgain": "Please try again or search for a different health goal.",
      "results.noSupplementsFound": "No supplements found for this health goal. Try a different search query.",
      "results.howWeMatch": "How We Match Supplements",
      "results.socialSentimentAnalysis": "Social Sentiment Analysis",
      "results.socialSentimentDesc": "AI scans X/Twitter and RedNote for recent user experiences, extracting benefits, side effects, and overall satisfaction patterns.",
      "results.scientificEvidenceGrading": "Scientific Evidence Grading",
      "results.scientificEvidenceDesc": "Cross-references ingredients with PubMed research. Evidence levels: A (strong RCTs), B (moderate studies), C (limited data), D (insufficient).",
      "results.ingredientEfficacyScoring": "Ingredient Efficacy Scoring",
      "results.ingredientEfficacyDesc": "Evaluates active ingredients based on bioavailability, dosage adequacy, and documented mechanisms of action.",
      "results.safetyInteractionChecks": "Safety & Interaction Checks",
      "results.safetyInteractionDesc": "Flags potential interactions with medications, contraindications, and side effects based on medical databases.",
      
      // Tabs
      "tabs.supplements": "Supplements",
      "tabs.pricing": "Pricing",
      "tabs.progress": "Progress"
    }
  },
  es: {
    translation: {
      // Hero Section
      "hero.title": "Descubre tus Suplementos Perfectos",
      "hero.subtitle": "Recomendaciones personalizadas de suplementos de salud impulsadas por IA respaldadas por investigación científica real",
      "hero.cta": "Comenzar",
      
      // Questionnaire
      "questionnaire.title": "Cuéntanos sobre ti",
      "questionnaire.age": "Edad",
      "questionnaire.gender": "Género",
      "questionnaire.male": "Masculino",
      "questionnaire.female": "Femenino",
      "questionnaire.other": "Otro",
      "questionnaire.healthGoals": "Objetivos de Salud",
      "questionnaire.healthGoals.placeholder": "ej., Mejorar el sueño, aumentar energía, reducir estrés",
      "questionnaire.allergies": "Alergias o Restricciones",
      "questionnaire.allergies.placeholder": "ej., Intolerante a lactosa, vegano, sin gluten",
      "questionnaire.medications": "Medicamentos Actuales",
      "questionnaire.medications.placeholder": "ej., Medicamento para presión arterial, insulina",
      "questionnaire.submit": "Obtener Mis Recomendaciones",
      
      // Results
      "results.title": "Tu Plan de Suplementos Personalizado",
      "results.analyzing": "Analizando tu perfil de salud...",
      "results.searching": "Buscando investigación científica...",
      
      // Supplement Card
      "supplement.dosage": "Dosis Recomendada",
      "supplement.benefits": "Beneficios Clave",
      "supplement.research": "Investigación Científica",
      "supplement.verified": "Verificado por PubMed",
      "supplement.timing": "Mejor Momento para Tomar",
      "supplement.sideEffects": "Posibles Efectos Secundarios",
      
      // Interaction Checker
      "interactions.title": "Interacciones de Suplementos",
      "interactions.medications": "Tus Medicamentos Actuales",
      "interactions.add": "Agregar Medicamento",
      "interactions.severity.high": "Alta",
      "interactions.severity.moderate": "Moderada",
      "interactions.severity.low": "Baja",
      "interactions.noInteractions": "No se detectaron interacciones conocidas",
      
      // Progress Tracker
      "progress.title": "Seguimiento de Progreso",
      "progress.rating": "¿Cómo te sientes hoy?",
      "progress.notes": "Notas y Observaciones",
      "progress.addEntry": "Registrar Entrada",
      "progress.stats": "Estadísticas",
      "progress.daysTracked": "Días Rastreados",
      "progress.avgRating": "Calificación Promedio",
      "progress.goodDays": "Días Buenos",
      "progress.history": "Historial de Progreso",
      
      // Price Comparison
      "price.title": "Comparación de Precios",
      "price.bestPrice": "Mejor Precio",
      "price.viewDeal": "Ver Oferta",
      "price.shipping": "Envío",
      "price.outOfStock": "Agotado",
      
      // Onboarding
      "onboarding.skip": "Saltar tutorial",
      "onboarding.next": "Siguiente",
      "onboarding.back": "Atrás",
      "onboarding.getStarted": "Comenzar",
      
      // Common
      "common.loading": "Cargando...",
      "common.error": "Algo salió mal",
      "common.retry": "Reintentar",
      "common.save": "Guardar",
      "common.cancel": "Cancelar",
      
      // Supplement Card
      "card.whyGoodForYou": "Por Qué Es Bueno Para Ti",
      "card.recommendedDose": "Dosis Recomendada",
      "card.userSentiment": "Sentimiento del Usuario",
      "card.positive": "Positivo",
      "card.basedOn": "Basado en",
      "card.reviews": "reseñas de redes sociales",
      "card.keyBenefits": "Beneficios Clave",
      "card.activeIngredients": "Ingredientes Activos",
      "card.safetyConsiderations": "Consideraciones de Seguridad",
      "card.scientificEvidence": "Evidencia Científica",
      "card.pubmedVerified": "Verificado por PubMed",
      "card.readFullStudy": "Leer Estudio Completo",
      "card.papersVerified": "Artículos verificados de la base de datos científica PubMed",
      "card.trendingOnSocial": "Tendencia en Redes Sociales",
      "card.posts": "publicaciones",
      "card.viewDetails": "Ver Detalles",
      "card.strongEvidence": "Evidencia Fuerte",
      "card.moderateEvidence": "Evidencia Moderada",
      "card.limitedEvidence": "Evidencia Limitada",
      "card.insufficientEvidence": "Evidencia Insuficiente",
      
      // Results Section
      "results.topMatchesFor": "Mejores Coincidencias para:",
      "results.basedOnAnalysis": "Basado en análisis de IA de más de 12,000 reseñas de redes sociales y más de 250 artículos científicos",
      "results.medicalDisclaimer": "Descargo de Responsabilidad Médica:",
      "results.disclaimerText": "Esta información es solo para fines educativos y no es consejo médico. Siempre consulte con un profesional de la salud antes de comenzar cualquier régimen de suplementos, especialmente si tiene condiciones de salud existentes o toma medicamentos. Los suplementos no están aprobados por la FDA para tratar, curar o prevenir enfermedades.",
      "results.analyzingReviews": "Analizando miles de reseñas y artículos científicos...",
      "results.errorText": "Error:",
      "results.tryAgain": "Por favor intente nuevamente o busque un objetivo de salud diferente.",
      "results.noSupplementsFound": "No se encontraron suplementos para este objetivo de salud. Intente una búsqueda diferente.",
      "results.howWeMatch": "Cómo Emparejamos Suplementos",
      "results.socialSentimentAnalysis": "Análisis de Sentimiento Social",
      "results.socialSentimentDesc": "La IA escanea X/Twitter y RedNote en busca de experiencias recientes de usuarios, extrayendo beneficios, efectos secundarios y patrones de satisfacción general.",
      "results.scientificEvidenceGrading": "Calificación de Evidencia Científica",
      "results.scientificEvidenceDesc": "Referencias cruzadas de ingredientes con investigación de PubMed. Niveles de evidencia: A (ECAs fuertes), B (estudios moderados), C (datos limitados), D (insuficiente).",
      "results.ingredientEfficacyScoring": "Puntuación de Eficacia de Ingredientes",
      "results.ingredientEfficacyDesc": "Evalúa ingredientes activos basándose en biodisponibilidad, adecuación de dosificación y mecanismos de acción documentados.",
      "results.safetyInteractionChecks": "Verificaciones de Seguridad e Interacción",
      "results.safetyInteractionDesc": "Señala posibles interacciones con medicamentos, contraindicaciones y efectos secundarios basados en bases de datos médicas.",
      
      // Tabs
      "tabs.supplements": "Suplementos",
      "tabs.pricing": "Precios",
      "tabs.progress": "Progreso"
    }
  },
  zh: {
    translation: {
      // Hero Section
      "hero.title": "发现您的完美补充剂",
      "hero.subtitle": "由人工智能驱动的个性化健康补充剂推荐，基于真实科学研究",
      "hero.cta": "开始使用",
      
      // Questionnaire
      "questionnaire.title": "告诉我们关于您的信息",
      "questionnaire.age": "年龄",
      "questionnaire.gender": "性别",
      "questionnaire.male": "男性",
      "questionnaire.female": "女性",
      "questionnaire.other": "其他",
      "questionnaire.healthGoals": "健康目标",
      "questionnaire.healthGoals.placeholder": "例如：改善睡眠、提高能量、减轻压力",
      "questionnaire.allergies": "过敏或限制",
      "questionnaire.allergies.placeholder": "例如：乳糖不耐受、素食、无麸质",
      "questionnaire.medications": "当前药物",
      "questionnaire.medications.placeholder": "例如：降压药、胰岛素",
      "questionnaire.submit": "获取我的推荐",
      
      // Results
      "results.title": "您的个性化补充剂计划",
      "results.analyzing": "正在分析您的健康档案...",
      "results.searching": "正在搜索科学研究...",
      
      // Supplement Card
      "supplement.dosage": "推荐剂量",
      "supplement.benefits": "主要益处",
      "supplement.research": "科学研究",
      "supplement.verified": "PubMed 已验证",
      "supplement.timing": "最佳服用时间",
      "supplement.sideEffects": "可能的副作用",
      
      // Interaction Checker
      "interactions.title": "补充剂相互作用",
      "interactions.medications": "您当前的药物",
      "interactions.add": "添加药物",
      "interactions.severity.high": "高",
      "interactions.severity.moderate": "中等",
      "interactions.severity.low": "低",
      "interactions.noInteractions": "未检测到已知相互作用",
      
      // Progress Tracker
      "progress.title": "进度跟踪器",
      "progress.rating": "您今天感觉如何？",
      "progress.notes": "笔记和观察",
      "progress.addEntry": "记录条目",
      "progress.stats": "统计数据",
      "progress.daysTracked": "跟踪天数",
      "progress.avgRating": "平均评分",
      "progress.goodDays": "良好天数",
      "progress.history": "进度历史",
      
      // Price Comparison
      "price.title": "价格比较",
      "price.bestPrice": "最佳价格",
      "price.viewDeal": "查看优惠",
      "price.shipping": "运费",
      "price.outOfStock": "缺货",
      
      // Onboarding
      "onboarding.skip": "跳过教程",
      "onboarding.next": "下一步",
      "onboarding.back": "返回",
      "onboarding.getStarted": "开始使用",
      
      // Common
      "common.loading": "加载中...",
      "common.error": "出现问题",
      "common.retry": "重试",
      "common.save": "保存",
      "common.cancel": "取消",
      
      // Supplement Card
      "card.whyGoodForYou": "为什么这对您有益",
      "card.recommendedDose": "推荐剂量",
      "card.userSentiment": "用户评价",
      "card.positive": "积极",
      "card.basedOn": "基于",
      "card.reviews": "社交媒体评论",
      "card.keyBenefits": "主要益处",
      "card.activeIngredients": "活性成分",
      "card.safetyConsiderations": "安全注意事项",
      "card.scientificEvidence": "科学证据",
      "card.pubmedVerified": "PubMed 已验证",
      "card.readFullStudy": "阅读完整研究",
      "card.papersVerified": "论文已从 PubMed 科学数据库验证",
      "card.trendingOnSocial": "社交媒体热门",
      "card.posts": "帖子",
      "card.viewDetails": "查看详情",
      "card.strongEvidence": "强证据",
      "card.moderateEvidence": "中等证据",
      "card.limitedEvidence": "有限证据",
      "card.insufficientEvidence": "证据不足",
      
      // Results Section
      "results.topMatchesFor": "最佳匹配：",
      "results.basedOnAnalysis": "基于 AI 分析 12,000+ 社交媒体评论和 250+ 科学论文",
      "results.medicalDisclaimer": "医疗免责声明：",
      "results.disclaimerText": "此信息仅用于教育目的，不是医疗建议。在开始任何补充剂方案之前，请务必咨询医疗保健提供者，特别是如果您有现有健康状况或服用药物。补充剂未经 FDA 批准用于治疗、治愈或预防疾病。",
      "results.analyzingReviews": "正在分析数千条评论和科学论文...",
      "results.errorText": "错误：",
      "results.tryAgain": "请重试或搜索不同的健康目标。",
      "results.noSupplementsFound": "未找到此健康目标的补充剂。尝试不同的搜索查询。",
      "results.howWeMatch": "我们如何匹配补充剂",
      "results.socialSentimentAnalysis": "社交情绪分析",
      "results.socialSentimentDesc": "AI 扫描 X/Twitter 和 RedNote 以获取最近的用户体验，提取益处、副作用和整体满意度模式。",
      "results.scientificEvidenceGrading": "科学证据评级",
      "results.scientificEvidenceDesc": "与 PubMed 研究交叉引用成分。证据级别：A（强 RCT），B（中等研究），C（有限数据），D（不足）。",
      "results.ingredientEfficacyScoring": "成分功效评分",
      "results.ingredientEfficacyDesc": "根据生物利用度、剂量充足性和记录的作用机制评估活性成分。",
      "results.safetyInteractionChecks": "安全和相互作用检查",
      "results.safetyInteractionDesc": "根据医疗数据库标记与药物的潜在相互作用、禁忌症和副作用。",
      
      // Tabs
      "tabs.supplements": "补充剂",
      "tabs.pricing": "定价",
      "tabs.progress": "进度"
    }
  },
  fr: {
    translation: {
      // Hero Section
      "hero.title": "Découvrez Vos Suppléments Parfaits",
      "hero.subtitle": "Recommandations personnalisées de suppléments de santé alimentées par l'IA et soutenues par la recherche scientifique réelle",
      "hero.cta": "Commencer",
      
      // Questionnaire
      "questionnaire.title": "Parlez-nous de Vous",
      "questionnaire.age": "Âge",
      "questionnaire.gender": "Sexe",
      "questionnaire.male": "Masculin",
      "questionnaire.female": "Féminin",
      "questionnaire.other": "Autre",
      "questionnaire.healthGoals": "Objectifs de Santé",
      "questionnaire.healthGoals.placeholder": "ex., Améliorer le sommeil, augmenter l'énergie, réduire le stress",
      "questionnaire.allergies": "Allergies ou Restrictions",
      "questionnaire.allergies.placeholder": "ex., Intolérant au lactose, végétalien, sans gluten",
      "questionnaire.medications": "Médicaments Actuels",
      "questionnaire.medications.placeholder": "ex., Médicament pour la tension artérielle, insuline",
      "questionnaire.submit": "Obtenir Mes Recommandations",
      
      // Results
      "results.title": "Votre Plan de Suppléments Personnalisé",
      "results.analyzing": "Analyse de votre profil de santé...",
      "results.searching": "Recherche scientifique en cours...",
      
      // Supplement Card
      "supplement.dosage": "Dosage Recommandé",
      "supplement.benefits": "Avantages Clés",
      "supplement.research": "Recherche Scientifique",
      "supplement.verified": "Vérifié par PubMed",
      "supplement.timing": "Meilleur Moment pour Prendre",
      "supplement.sideEffects": "Effets Secondaires Possibles",
      
      // Interaction Checker
      "interactions.title": "Interactions des Suppléments",
      "interactions.medications": "Vos Médicaments Actuels",
      "interactions.add": "Ajouter un Médicament",
      "interactions.severity.high": "Élevée",
      "interactions.severity.moderate": "Modérée",
      "interactions.severity.low": "Faible",
      "interactions.noInteractions": "Aucune interaction connue détectée",
      
      // Progress Tracker
      "progress.title": "Suivi des Progrès",
      "progress.rating": "Comment vous sentez-vous aujourd'hui?",
      "progress.notes": "Notes et Observations",
      "progress.addEntry": "Enregistrer l'Entrée",
      "progress.stats": "Statistiques",
      "progress.daysTracked": "Jours Suivis",
      "progress.avgRating": "Note Moyenne",
      "progress.goodDays": "Bons Jours",
      "progress.history": "Historique des Progrès",
      
      // Price Comparison
      "price.title": "Comparaison de Prix",
      "price.bestPrice": "Meilleur Prix",
      "price.viewDeal": "Voir l'Offre",
      "price.shipping": "Livraison",
      "price.outOfStock": "En Rupture de Stock",
      
      // Onboarding
      "onboarding.skip": "Passer le tutoriel",
      "onboarding.next": "Suivant",
      "onboarding.back": "Retour",
      "onboarding.getStarted": "Commencer",
      
      // Common
      "common.loading": "Chargement...",
      "common.error": "Quelque chose s'est mal passé",
      "common.retry": "Réessayer",
      "common.save": "Enregistrer",
      "common.cancel": "Annuler",
      
      // Supplement Card
      "card.whyGoodForYou": "Pourquoi C'est Bon Pour Vous",
      "card.recommendedDose": "Dosage Recommandé",
      "card.userSentiment": "Sentiment des Utilisateurs",
      "card.positive": "Positif",
      "card.basedOn": "Basé sur",
      "card.reviews": "avis sur les réseaux sociaux",
      "card.keyBenefits": "Avantages Clés",
      "card.activeIngredients": "Ingrédients Actifs",
      "card.safetyConsiderations": "Considérations de Sécurité",
      "card.scientificEvidence": "Preuves Scientifiques",
      "card.pubmedVerified": "Vérifié par PubMed",
      "card.readFullStudy": "Lire l'Étude Complète",
      "card.papersVerified": "Articles vérifiés de la base de données scientifique PubMed",
      "card.trendingOnSocial": "Tendance sur les Réseaux Sociaux",
      "card.posts": "publications",
      "card.viewDetails": "Voir les Détails",
      "card.strongEvidence": "Preuves Solides",
      "card.moderateEvidence": "Preuves Modérées",
      "card.limitedEvidence": "Preuves Limitées",
      "card.insufficientEvidence": "Preuves Insuffisantes",
      
      // Results Section
      "results.topMatchesFor": "Meilleures Correspondances pour :",
      "results.basedOnAnalysis": "Basé sur l'analyse IA de plus de 12 000 avis sur les réseaux sociaux et plus de 250 articles scientifiques",
      "results.medicalDisclaimer": "Avertissement Médical :",
      "results.disclaimerText": "Ces informations sont à des fins éducatives uniquement et ne constituent pas un avis médical. Consultez toujours un professionnel de la santé avant de commencer tout régime de suppléments, surtout si vous avez des problèmes de santé existants ou prenez des médicaments. Les suppléments ne sont pas approuvés par la FDA pour traiter, guérir ou prévenir les maladies.",
      "results.analyzingReviews": "Analyse de milliers d'avis et d'articles scientifiques...",
      "results.errorText": "Erreur :",
      "results.tryAgain": "Veuillez réessayer ou rechercher un objectif de santé différent.",
      "results.noSupplementsFound": "Aucun supplément trouvé pour cet objectif de santé. Essayez une recherche différente.",
      "results.howWeMatch": "Comment Nous Associons les Suppléments",
      "results.socialSentimentAnalysis": "Analyse du Sentiment Social",
      "results.socialSentimentDesc": "L'IA analyse X/Twitter et RedNote pour les expériences récentes des utilisateurs, extrayant les avantages, les effets secondaires et les modèles de satisfaction globale.",
      "results.scientificEvidenceGrading": "Évaluation des Preuves Scientifiques",
      "results.scientificEvidenceDesc": "Références croisées des ingrédients avec la recherche PubMed. Niveaux de preuve : A (ECR solides), B (études modérées), C (données limitées), D (insuffisant).",
      "results.ingredientEfficacyScoring": "Évaluation de l'Efficacité des Ingrédients",
      "results.ingredientEfficacyDesc": "Évalue les ingrédients actifs en fonction de la biodisponibilité, de l'adéquation du dosage et des mécanismes d'action documentés.",
      "results.safetyInteractionChecks": "Vérifications de Sécurité et d'Interaction",
      "results.safetyInteractionDesc": "Signale les interactions potentielles avec les médicaments, les contre-indications et les effets secondaires basés sur les bases de données médicales.",
      
      // Tabs
      "tabs.supplements": "Suppléments",
      "tabs.pricing": "Tarification",
      "tabs.progress": "Progrès"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en", // default language
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
