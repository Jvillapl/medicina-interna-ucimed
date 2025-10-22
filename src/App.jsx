import React, { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";

import { Input } from "./components/ui/input";
import { Textarea } from "./components/ui/textarea";
import { Button } from "./components/ui/button";
import { Badge } from "./components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select";
import { MedicalChatbot } from "./components/MedicalChatbot";

import { Toaster, toast } from "sonner";
import { Calendar, Mail, Newspaper, GraduationCap, ShieldCheck, ExternalLink, Instagram, BookOpen, FileText, Send, Stethoscope } from "lucide-react";

// Importar funciones de Supabase
import { submitArticle, getSubmissionStats } from './lib/supabase.js';

// ------- Utilidades simples ---------
const cls = (...c) => c.filter(Boolean).join(" ");
const todayISO = () => new Date().toISOString().slice(0,10);

// ------- Datos de publicaciones ampliado con contenido educativo ---------
const INSTAGRAM_POSTS = [
  {
    id: "ig_1",
    title: "Síndrome Coronario Agudo: Diagnóstico diferencial",
    summary: "Infografía completa sobre criterios diagnósticos, biomarcadores y manejo inicial en urgencias. Incluye algoritmo de decisión.",
    tags: ["Cardio", "Urgencias"],
    cover: "https://placehold.co/800x500/2563eb/ffffff?text=SCA+Diagnóstico",
    date: "2025-10-20",
    author: "Medicina Interna UCIMED",
    link: "https://instagram.com/medicina_interna_ucimed",
    source: "Instagram",
    likes: 127,
    content: "🚨 SÍNDROME CORONARIO AGUDO - Guía rápida para estudiantes\n\n📋 CRITERIOS DIAGNÓSTICOS:\n• Dolor torácico típico >20min\n• Cambios electrocardiográficos\n• Elevación de troponinas\n\n🔬 BIOMARCADORES:\n• Troponina I/T (más específica)\n• CK-MB (complementario)\n• Tiempo óptimo: 6-12h post-síntomas\n\n⚡ MANEJO INICIAL:\n1. AAS 325mg + Clopidogrel\n2. Anticoagulación (heparina)\n3. Estratificación de riesgo\n4. Cateterismo si STEMI\n\n#MedicinaInterna #Cardiología #EstudiantesMedicina #UCIMED"
  },
  {
    id: "ig_2", 
    title: "Interpretación de Gasometría Arterial paso a paso",
    summary: "Método sistemático para analizar gasometrías. Incluye casos clínicos prácticos y algoritmo de interpretación.",
    tags: ["Neumo", "Urgencias"],
    cover: "https://placehold.co/800x500/059669/ffffff?text=Gasometría+Arterial",
    date: "2025-10-19",
    author: "Medicina Interna UCIMED", 
    link: "https://instagram.com/medicina_interna_ucimed",
    source: "Instagram",
    likes: 203,
    content: "🫁 GASOMETRÍA ARTERIAL - Interpretación sistemática\n\n📊 MÉTODO PASO A PASO:\n\n1️⃣ pH (7.35-7.45)\n• <7.35 = Acidemia\n• >7.45 = Alcalemia\n\n2️⃣ CO2 (35-45 mmHg)\n• Compensación respiratoria\n• Causa primaria respiratoria\n\n3️⃣ HCO3 (22-26 mEq/L)\n• Compensación metabólica\n• Causa primaria metabólica\n\n4️⃣ PO2 (80-100 mmHg)\n• Evaluación oxigenación\n• Gradiente A-a\n\n💡 REGLA: Nunca hay sobrecompensación completa\n\n#Neumología #Urgencias #MedicinaInterna #UCIMED"
  },
  {
    id: "ig_3",
    title: "Diabetes Mellitus Tipo 2: Nuevas guías ADA 2025",
    summary: "Actualización en manejo farmacológico, metas de HbA1c y prevención de complicaciones cardiovasculares.",
    tags: ["Endocrino"],
    cover: "https://placehold.co/800x500/dc2626/ffffff?text=Diabetes+ADA+2025",
    date: "2025-10-18",
    author: "Medicina Interna UCIMED",
    link: "https://instagram.com/medicina_interna_ucimed", 
    source: "Instagram",
    likes: 156,
    content: "📈 DIABETES TIPO 2 - Guías ADA 2025\n\n🎯 METAS GLUCÉMICAS:\n• HbA1c <7% (general)\n• <6.5% si joven, sin comorbilidades\n• <8% si edad avanzada/comorbilidades\n\n💊 ALGORITMO FARMACOLÓGICO:\n1. Metformina (primera línea)\n2. iSGLT2/aGLP1 si riesgo CV\n3. Insulina si HbA1c >10%\n\n🫀 PREVENCIÓN CARDIOVASCULAR:\n• iSGLT2: empagliflozina, dapagliflozina\n• aGLP1: liraglutida, semaglutida\n• Estatinas en todos los pacientes\n\n📊 MONITOREO:\n• HbA1c cada 3-6 meses\n• Función renal anual\n• Fondo de ojo anual\n\n#Endocrinología #Diabetes #MedicinaInterna #UCIMED"
  },
  {
    id: "ig_4",
    title: "Hipertensión Arterial: Clasificación y manejo 2025",
    summary: "Nuevos umbrales diagnósticos, clasificación de riesgo y algoritmo de tratamiento farmacológico escalonado.",
    tags: ["Cardio"],
    cover: "https://placehold.co/800x500/7c3aed/ffffff?text=Hipertensión+2025",
    date: "2025-10-17",
    author: "Medicina Interna UCIMED",
    link: "https://instagram.com/medicina_interna_ucimed",
    source: "Instagram", 
    likes: 189,
    content: "🩸 HIPERTENSIÓN ARTERIAL - Guías 2025\n\n📏 CLASIFICACIÓN (mmHg):\n• Normal: <120/80\n• Elevada: 120-129/<80\n• Estadio 1: 130-139/80-89\n• Estadio 2: ≥140/90\n• Crisis: >180/120\n\n💊 TRATAMIENTO ESCALONADO:\n\n1️⃣ PRIMERA LÍNEA:\n• IECA/ARA II\n• Tiazidas/clortalidona\n• Calcioantagonistas\n\n2️⃣ COMBINACIONES:\n• IECA + tiazida\n• IECA + calcioantagonista\n• Triple terapia si necesario\n\n🎯 METAS:\n• <130/80 mmHg (general)\n• <140/90 mmHg (>65 años)\n\n#Cardiología #Hipertensión #MedicinaInterna #UCIMED"
  },
  {
    id: "ig_5", 
    title: "Infección del Tracto Urinario: Diagnóstico y tratamiento",
    summary: "Criterios diagnósticos, interpretación de urocultivo y esquemas antibióticos según severidad y factores de riesgo.",
    tags: ["Infectología", "Nefrología"],
    cover: "https://placehold.co/800x500/ea580c/ffffff?text=ITU+Diagnóstico", 
    date: "2025-10-16",
    author: "Medicina Interna UCIMED",
    link: "https://instagram.com/medicina_interna_ucimed",
    source: "Instagram",
    likes: 234,
    content: "🦠 INFECCIÓN TRACTO URINARIO - Guía práctica\n\n🔬 DIAGNÓSTICO:\n• Síntomas + EGO alterado\n• Nitritos/esterasa leucocitaria +\n• Urocultivo >100,000 UFC/mL\n• Piuria >10 leucocitos/campo\n\n💊 TRATAMIENTO EMPÍRICO:\n\n🟢 ITU SIMPLE (mujer):\n• Nitrofurantoína 100mg c/12h x 5d\n• TMP/SMX 160/800mg c/12h x 3d\n\n🟡 ITU COMPLICADA:\n• Ciprofloxacina 500mg c/12h x 7-10d\n• Ceftriaxona 1g IV c/24h\n\n🔴 PIELONEFRITIS:\n• Ceftriaxona + aminoglucósido\n• Ertapenem si sospecha BLEE\n\n⚠️ Siempre ajustar según antibiograma\n\n#Infectología #Nefrología #Antibióticos #UCIMED"
  },
  {
    id: "ig_6",
    title: "Insuficiencia Cardíaca: Clasificación NYHA y tratamiento",
    summary: "Fisiopatología, clasificación funcional, biomarcadores y manejo farmacológico basado en evidencia.",
    tags: ["Cardio"],
    cover: "https://placehold.co/800x500/1d4ed8/ffffff?text=Insuficiencia+Cardíaca",
    date: "2025-10-15", 
    author: "Medicina Interna UCIMED",
    link: "https://instagram.com/medicina_interna_ucimed",
    source: "Instagram",
    likes: 178,
    content: "❤️ INSUFICIENCIA CARDÍACA - Manejo integral\n\n📊 CLASIFICACIÓN NYHA:\n• Clase I: Sin limitación\n• Clase II: Limitación leve\n• Clase III: Limitación marcada\n• Clase IV: Síntomas en reposo\n\n🔬 BIOMARCADORES:\n• NT-proBNP >125 pg/mL\n• BNP >35 pg/mL\n• Troponina (pronóstico)\n\n💊 TRATAMIENTO FE REDUCIDA:\n1. IECA/ARA II/ARNI\n2. Betabloqueadores\n3. ARM (espironolactona)\n4. iSGLT2 (dapagliflozina)\n\n⚖️ MANEJO NO FARMACOLÓGICO:\n• Restricción sodio <2g/día\n• Restricción líquidos si severa\n• Ejercicio supervisado\n• Vacunación (influenza, neumococo)\n\n#Cardiología #InsuficienciaCardíaca #MedicinaInterna #UCIMED"
  },
  {
    id: "ig_7",
    title: "Hipotiroidismo: Diagnóstico y seguimiento",
    summary: "Interpretación de función tiroidea, causas más frecuentes y manejo con levotiroxina. Casos especiales.",
    tags: ["Endocrino"],
    cover: "https://placehold.co/800x500/16a34a/ffffff?text=Hipotiroidismo", 
    date: "2025-10-14",
    author: "Medicina Interna UCIMED",
    link: "https://instagram.com/medicina_interna_ucimed",
    source: "Instagram",
    likes: 145,
    content: "🦋 HIPOTIROIDISMO - Diagnóstico y manejo\n\n🔬 INTERPRETACIÓN TSH/T4L:\n• TSH >4.5 mUI/L (sospecha)\n• T4L bajo = hipotiroidismo manifiesto\n• T4L normal = hipotiroidismo subclínico\n\n🎯 CAUSAS PRINCIPALES:\n• Tiroiditis de Hashimoto (90%)\n• Post-tiroidectomía\n• Radioyodo\n• Medicamentos (amiodarona, litio)\n\n💊 TRATAMIENTO:\n• Levotiroxina 1.6 mcg/kg/día\n• Tomar en ayunas, 30-60min antes del desayuno\n• Control TSH a las 6-8 semanas\n• Meta: TSH 0.5-2.5 mUI/L\n\n⚠️ CASOS ESPECIALES:\n• Embarazo: aumentar dosis 30-50%\n• Cardiopatía: iniciar dosis bajas\n• Ancianos: 25-50 mcg inicio\n\n#Endocrinología #Tiroides #MedicinaInterna #UCIMED"
  },
  {
    id: "ig_8",
    title: "Enfermedad Renal Crónica: Estadificación y manejo",
    summary: "Clasificación por TFG, albuminuria, complicaciones y estrategias de nefroprotección.",
    tags: ["Nefrología"],
    cover: "https://placehold.co/800x500/0891b2/ffffff?text=ERC+Estadificación",
    date: "2025-10-13",
    author: "Medicina Interna UCIMED", 
    link: "https://instagram.com/medicina_interna_ucimed",
    source: "Instagram",
    likes: 167,
    content: "🫘 ENFERMEDAD RENAL CRÓNICA - Guía KDIGO\n\n📊 ESTADIFICACIÓN POR TFG:\n• G1: >90 (normal con daño)\n• G2: 60-89 (leve ↓)\n• G3a: 45-59 (moderada ↓)\n• G3b: 30-44 (moderada-severa ↓)\n• G4: 15-29 (severa ↓)\n• G5: <15 (falla renal)\n\n🧪 ALBUMINURIA (mg/g):\n• A1: <30 (normal)\n• A2: 30-300 (microalbuminuria)\n• A3: >300 (macroalbuminuria)\n\n🛡️ NEFROPROTECCIÓN:\n• IECA/ARA II (primera línea)\n• Control PA <130/80\n• HbA1c <7% en diabéticos\n• iSGLT2 si diabetes\n\n⚠️ COMPLICACIONES:\n• Anemia (TFG <30)\n• Trastorno mineral óseo\n• Acidosis metabólica\n• Preparar diálisis (TFG <20)\n\n#Nefrología #ERC #MedicinaInterna #UCIMED"
  }
];

const DEMO_POSTS = [
  {
    id: "1",
    title: "Diferencia entre hipertiroidismo y tirotoxicosis",
    summary: "Revisión breve de fisiopatología, causas y manejo inicial en urgencias.",
    tags: ["Endocrino", "Urgencias"],
    cover: "https://placehold.co/800x500/png?text=Hipertiroidismo",
    date: "2025-10-18",
    author: "Grupo de Interés Medicina Interna UCIMED",
    link: "#",
    source: "Original"
  },
  {
    id: "2",
    title: "Escala KDIGO para lesión renal aguda (LRA)",
    summary: "Cómo aplicar la clasificación KDIGO en la práctica clínica del internista.",
    tags: ["Nefrología"],
    cover: "https://placehold.co/800x500/png?text=KDIGO",
    date: "2025-10-17",
    author: "Equipo Nefro UCIMED",
    link: "#",
    source: "Original"
  },
  {
    id: "3",
    title: "Clasificación Child-Pugh: perlas para el examen físico y cálculo",
    summary: "Recordatorio práctico para rotaciones de gastro y emergencias.",
    tags: ["Gastro", "Hepatología"],
    cover: "https://placehold.co/800x500/png?text=Child-Pugh",
    date: "2025-10-12",
    author: "Comité Académico",
    link: "#",
    source: "Original"
  },
];

// Combinar publicaciones originales con contenido de Instagram
const ALL_POSTS = [...INSTAGRAM_POSTS, ...DEMO_POSTS];

const DEMO_EVENTS = [
  { date: "2025-10-25", title: "Voluntariado – Feria de Salud", place: "El Huazo, Desamparados", details: "Actividad comunitaria con toma de signos, educación y referencia." },
  { date: "2025-11-08", title: "Club de Artículos: Insuficiencia Cardiaca 2023-24", place: "UCIMED – Aula 203", details: "Discusión de guías y ensayo EMPEROR-Preserved." },
];

const TAGS = [
  "Todos", "Cardio", "Nefrología", "Endocrino", "Infectología", "Neumo", "Reumatología", "Gastro", "Hepatología", "Urgencias"
];

// ------- Almacenamiento de envíos en localStorage ---------
const STORAGE_KEY = "ucimed_mi_submissions_v1";
const saveSubmission = (s) => {
  const prev = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  const next = [s, ...prev];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
};
const readSubmissions = () => JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

// ------- Componentes UI ---------
function Navbar(){
  return (
    <div className="sticky top-0 z-40 backdrop-blur-md bg-white/80 border-b border-white/20 shadow-lg">
      <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-600 grid place-items-center shadow-lg pulse-glow">
            <Stethoscope className="w-7 h-7 text-white" />
          </div>
          <div>
            <div className="text-xl font-bold bg-gradient-to-r from-blue-700 to-cyan-700 bg-clip-text text-transparent">Medicina Interna UCIMED</div>
            <div className="text-xs text-slate-500 font-medium">Grupo de Interés – Estudiantes</div>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-1">
          <a href="#publicaciones" className="px-4 py-2 rounded-xl hover:bg-blue-50 transition-all duration-300 text-slate-700 font-medium">Publicaciones</a>
          <a href="#eventos" className="px-4 py-2 rounded-xl hover:bg-blue-50 transition-all duration-300 text-slate-700 font-medium">Eventos</a>
          <a href="#equipo" className="px-4 py-2 rounded-xl hover:bg-blue-50 transition-all duration-300 text-slate-700 font-medium">Equipo</a>
          <a href="#enviar" className="px-4 py-2 rounded-xl hover:bg-blue-50 transition-all duration-300 text-slate-700 font-medium">Enviar artículo</a>
          <a className="px-4 py-2 rounded-xl hover:bg-blue-50 transition-all duration-300 inline-flex items-center gap-2 text-slate-700 font-medium" href="https://instagram.com/medicina_interna_ucimed" target="_blank" rel="noreferrer">
            <Instagram className="w-4 h-4"/> Instagram
          </a>
        </div>
      </div>
    </div>
  );
}

function Hero(){
  return (
    <div className="gradient-hero relative overflow-hidden">
      {/* Elementos de fondo decorativos */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-cyan-200/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-100/20 to-cyan-100/20 rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-6xl mx-auto px-4 py-20 md:py-28 relative z-10">
        <motion.div initial={{opacity:0, y:30}} animate={{opacity:1, y:0}} transition={{duration:0.8}} className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <motion.h1 
              initial={{opacity:0, y:20}} 
              animate={{opacity:1, y:0}} 
              transition={{duration:0.8, delay:0.2}}
              className="text-5xl md:text-6xl font-bold leading-tight"
            >
              Conocimiento clínico hecho por estudiantes, para estudiantes.
            </motion.h1>
            <motion.p 
              initial={{opacity:0, y:20}} 
              animate={{opacity:1, y:0}} 
              transition={{duration:0.8, delay:0.4}}
              className="mt-6 text-xl text-slate-600 leading-relaxed"
            >
              Resúmenes de temas clave, infografías, guías rápidas y clubes de artículos
              del <strong className="text-blue-700">Grupo de Interés en Medicina Interna UCIMED</strong>.
            </motion.p>
            <motion.div 
              initial={{opacity:0, y:20}} 
              animate={{opacity:1, y:0}} 
              transition={{duration:0.8, delay:0.6}}
              className="mt-8 flex flex-col sm:flex-row gap-4"
            >
              <a href="#publicaciones"><Button size="lg" className="text-lg px-8 py-4">Ver publicaciones</Button></a>
              <a href="#enviar"><Button size="lg" variant="outline" className="text-lg px-8 py-4">Proponer artículo</Button></a>
            </motion.div>
            <motion.div 
              initial={{opacity:0, y:20}} 
              animate={{opacity:1, y:0}} 
              transition={{duration:0.8, delay:0.8}}
              className="mt-8 flex flex-col sm:flex-row gap-6 text-sm text-slate-600"
            >
              <span className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                <ShieldCheck className="w-5 h-5 text-blue-600"/> Revisión por pares estudiantil
              </span>
              <span className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                <GraduationCap className="w-5 h-5 text-blue-600"/> Enfoque docente
              </span>
            </motion.div>
          </div>
          <motion.div
            initial={{opacity:0, x:30}} 
            animate={{opacity:1, x:0}} 
            transition={{duration:0.8, delay:0.4}}
            className="float-animation"
          >
            <Card className="shadow-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-3"><Newspaper className="w-6 h-6 text-blue-600"/> Lo más reciente</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                {DEMO_POSTS.slice(0,2).map(p => (
                  <a key={p.id} href="#publicaciones" className="p-5 rounded-2xl border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all duration-300 bg-gradient-to-r from-white to-blue-50/30">
                    <div className="text-sm text-slate-500 font-medium">{new Date(p.date).toLocaleDateString()}</div>
                    <div className="font-bold mt-2 text-slate-800 leading-snug">{p.title}</div>
                    <div className="text-sm text-slate-600 line-clamp-2 mt-1">{p.summary}</div>
                    <div className="mt-3 flex gap-2 flex-wrap">
                      {p.tags.map(t => <Badge key={t} variant="secondary">{t}</Badge>)}
                    </div>
                  </a>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

function PublicacionCard({ p }){
  const [showFullContent, setShowFullContent] = useState(false);
  
  return (
    <Card className="overflow-hidden h-full flex flex-col group">
      <div className="relative overflow-hidden">
        <img 
          src={p.cover} 
          alt={p.title} 
          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Badge de fuente */}
        {p.source && (
          <div className="absolute top-3 right-3">
            <Badge 
              variant={p.source === "Instagram" ? "default" : "secondary"}
              className={p.source === "Instagram" ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white" : ""}
            >
              {p.source === "Instagram" && <Instagram className="w-3 h-3 mr-1" />}
              {p.source}
            </Badge>
          </div>
        )}
      </div>
      
      <CardContent className="p-6 flex flex-col gap-4 flex-1">
        <div className="flex items-center justify-between text-xs text-slate-500 font-medium uppercase tracking-wide">
          <span>{new Date(p.date).toLocaleDateString()} · {p.author}</span>
          {p.likes && (
            <span className="flex items-center gap-1">
              ❤️ {p.likes}
            </span>
          )}
        </div>
        
        <div className="font-bold text-xl leading-snug text-slate-800 group-hover:text-blue-700 transition-colors duration-300">
          {p.title}
        </div>
        
        <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">
          {p.summary}
        </p>
        
        {/* Contenido expandible para posts de Instagram */}
        {p.content && (
          <div className="border-t pt-4">
            <p className={`text-sm text-slate-600 leading-relaxed whitespace-pre-line ${
              showFullContent ? '' : 'line-clamp-4'
            }`}>
              {p.content}
            </p>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowFullContent(!showFullContent)}
              className="mt-2 p-0 h-auto text-blue-600 hover:text-blue-700"
            >
              {showFullContent ? 'Ver menos' : 'Ver más'}
            </Button>
          </div>
        )}
        
        <div className="mt-auto flex items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            {p.tags.map((t) => <Badge key={t} variant="secondary">{t}</Badge>)}
          </div>
          <Button variant="ghost" size="sm" asChild>
            <a href={p.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2">
              {p.source === "Instagram" ? "Ver en Instagram" : "Leer"} 
              <ExternalLink className="w-4 h-4"/>
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function InstagramFeed() {
  const instagramPosts = ALL_POSTS.filter(p => p.source === "Instagram").slice(0, 6);
  
  return (
    <motion.div 
      initial={{opacity:0, y:30}} 
      whileInView={{opacity:1, y:0}} 
      transition={{duration:0.6}}
      viewport={{once: true}}
      className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm"
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-2xl font-bold text-slate-800 mb-2 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
              <Instagram className="w-4 h-4 text-white" />
            </div>
            Desde Instagram
          </h3>
          <p className="text-slate-600">Últimas publicaciones educativas</p>
        </div>
        <Button variant="outline" asChild>
          <a href="https://instagram.com/medicina_interna_ucimed" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2">
            Seguir <ExternalLink className="w-4 h-4"/>
          </a>
        </Button>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {instagramPosts.map((post) => (
          <motion.div
            key={post.id}
            initial={{opacity:0, y:20}} 
            whileInView={{opacity:1, y:0}} 
            transition={{duration:0.4}}
            viewport={{once: true}}
            className="group"
          >
            <div className="relative overflow-hidden rounded-2xl mb-4">
              <img 
                src={post.cover} 
                alt={post.title} 
                className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <div className="absolute bottom-3 left-3 right-3">
                <div className="flex items-center justify-between text-white text-sm">
                  <span className="flex items-center gap-1">
                    ❤️ {post.likes}
                  </span>
                  <div className="flex gap-1">
                    {post.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs bg-white/20 text-white border-white/20">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-slate-800 line-clamp-2 group-hover:text-blue-600 transition-colors">
                {post.title}
              </h4>
              <p className="text-sm text-slate-600 line-clamp-2">
                {post.summary}
              </p>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>{new Date(post.date).toLocaleDateString()}</span>
                <Button variant="ghost" size="sm" asChild className="p-0 h-auto text-blue-600 hover:text-blue-700">
                  <a href={post.link} target="_blank" rel="noreferrer">
                    Ver post
                  </a>
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function ContentStats() {
  const totalPosts = ALL_POSTS.length;
  const instagramPosts = ALL_POSTS.filter(p => p.source === "Instagram").length;
  const totalLikes = ALL_POSTS.reduce((sum, p) => sum + (p.likes || 0), 0);
  const specialties = [...new Set(ALL_POSTS.flatMap(p => p.tags))].length;

  return (
    <motion.div 
      initial={{opacity:0, y:30}} 
      whileInView={{opacity:1, y:0}} 
      transition={{duration:0.6}}
      viewport={{once: true}}
      className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-3xl p-8 mb-12"
    >
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Contenido Educativo</h3>
        <p className="text-slate-600">Publicaciones de medicina interna para estudiantes</p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-600 mb-1">{totalPosts}</div>
          <div className="text-sm text-slate-600">Publicaciones totales</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-purple-600 mb-1">{instagramPosts}</div>
          <div className="text-sm text-slate-600">Posts de Instagram</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-pink-600 mb-1">{totalLikes.toLocaleString()}</div>
          <div className="text-sm text-slate-600">Total de likes</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-cyan-600 mb-1">{specialties}</div>
          <div className="text-sm text-slate-600">Especialidades</div>
        </div>
      </div>
    </motion.div>
  );
}

function Publicaciones(){
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState("Todos");

  const filtered = useMemo(() => {
    return ALL_POSTS.filter(p =>
      (tag === "Todos" || p.tags.includes(tag)) &&
      (p.title.toLowerCase().includes(query.toLowerCase()) || p.summary.toLowerCase().includes(query.toLowerCase()))
    );
  }, [query, tag]);

  return (
    <div className="py-8">
      {/* Estadísticas de contenido */}
      <ContentStats />
      
      {/* Feed de Instagram */}
      <div className="mb-12">
        <InstagramFeed />
      </div>
      
      <motion.div 
        initial={{opacity:0, y:30}} 
        whileInView={{opacity:1, y:0}} 
        transition={{duration:0.6}}
        viewport={{once: true}}
        className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12"
      >
        <div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-700 to-cyan-700 bg-clip-text text-transparent">
            Publicaciones
          </h2>
          <p className="text-slate-600 text-lg mt-2">Contenido educativo de Instagram y publicaciones originales.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          <Input 
            placeholder="Buscar publicaciones..." 
            className="min-w-[250px]" 
            value={query} 
            onChange={(e)=>setQuery(e.target.value)} 
          />
          <Select value={tag} onValueChange={setTag}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filtrar por área"/>
            </SelectTrigger>
            <SelectContent>
              {TAGS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      <motion.div 
        initial={{opacity:0, y:30}} 
        whileInView={{opacity:1, y:0}} 
        transition={{duration:0.6, delay:0.2}}
        viewport={{once: true}}
        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {filtered.map((p, index) => (
          <motion.div
            key={p.id}
            initial={{opacity:0, y:30}} 
            whileInView={{opacity:1, y:0}} 
            transition={{duration:0.6, delay: index * 0.1}}
            viewport={{once: true}}
          >
            <PublicacionCard p={p} />
          </motion.div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-16">
            <div className="text-slate-400 text-lg">No hay resultados con ese filtro.</div>
            <p className="text-slate-500 text-sm mt-2">Intenta con otros términos de búsqueda o área.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}

function Eventos(){
  return (
    <div className="py-8 bg-gradient-to-r from-blue-50/50 to-cyan-50/50 rounded-3xl">
      <motion.div
        initial={{opacity:0, y:30}} 
        whileInView={{opacity:1, y:0}} 
        transition={{duration:0.6}}
        viewport={{once: true}}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-10">
          <h2 className="text-4xl font-bold flex items-center gap-3 bg-gradient-to-r from-blue-700 to-cyan-700 bg-clip-text text-transparent">
            <Calendar className="w-8 h-8 text-blue-600"/> Eventos
          </h2>
          <Badge variant="secondary" className="text-sm px-4 py-2 mt-4 sm:mt-0">
            {new Date().toLocaleDateString()}
          </Badge>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {DEMO_EVENTS.map((ev, idx) => (
            <motion.div
              key={idx}
              initial={{opacity:0, y:30}} 
              whileInView={{opacity:1, y:0}} 
              transition={{duration:0.6, delay: idx * 0.2}}
              viewport={{once: true}}
            >
              <Card className="relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-blue-500 to-cyan-500"></div>
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl pl-4">{ev.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-slate-600 pl-10">
                  <div className="font-semibold text-blue-700 mb-2">
                    📅 {new Date(ev.date).toLocaleDateString()} · 📍 {ev.place}
                  </div>
                  <div className="leading-relaxed">{ev.details}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function Equipo(){
  const members = [
    { name: "Luis Bonilla", role: "Coordinador", social: "@luisboncr", color: "from-blue-500 to-blue-600" },
    { name: "Julia", role: "Subcoordinadora", social: "@julia9134", color: "from-purple-500 to-pink-500" },
    { name: "Sofía", role: "Redes", social: "@_sofiabarrantes", color: "from-emerald-500 to-cyan-500" },
    { name: "Jose Villaplana", role: "Developer", social: "@jose_villa_0299", color: "from-orange-500 to-red-500" }, // Actualizado
  ];
  
  return (
    <div className="py-8">
      <motion.div
        initial={{opacity:0, y:30}} 
        whileInView={{opacity:1, y:0}} 
        transition={{duration:0.6}}
        viewport={{once: true}}
      >
        <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-700 to-cyan-700 bg-clip-text text-transparent mb-4">
          Equipo
        </h2>
        <p className="text-slate-600 text-lg mb-12">Conoce a las personas detrás del grupo de interés.</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {members.map((m, i) => (
            <motion.div
              key={i}
              initial={{opacity:0, y:30}} 
              whileInView={{opacity:1, y:0}} 
              transition={{duration:0.6, delay: i * 0.15}}
              viewport={{once: true}}
            >
              <Card className="text-center group hover:scale-105 transition-transform duration-300">
                <CardContent className="p-6">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${m.color} grid place-items-center text-xl font-bold text-white shadow-lg mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    {m.name.split(' ').map(n => n.charAt(0)).join('')}
                  </div>
                  <div className="font-bold text-lg text-slate-800 mb-1 leading-tight">{m.name}</div>
                  <div className="text-blue-600 font-semibold mb-2 text-sm">{m.role}</div>
                  <div className="text-xs text-slate-500">{m.social}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function FormEnviar(){
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    authors: "",
    summary: "",
    keywords: "",
    doi: "",
    pdf: "",
    area: "Cardio",
    ethics: false,
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    if(!form.title || !form.authors || !form.summary){
      toast.error("Completa título, autores y resumen");
      return;
    }
    if(!form.ethics) {
      toast.error("Debes aceptar la declaración ética");
      return;
    }
    
    setLoading(true);
    
    try {
      // Enviar a Supabase
      const result = await submitArticle(form);
      
      if (result.success) {
        toast.success("¡Artículo enviado exitosamente! 🎉\nRecibirás confirmación por email.");
        setForm({ title:"", authors:"", summary:"", keywords:"", doi:"", pdf:"", area:"Cardio", ethics:false });
        
        // También guardar localmente como respaldo
        const submission = { ...form, id: crypto.randomUUID(), date: new Date().toISOString() };
        saveSubmission(submission);
      } else {
        toast.error(`Error al enviar: ${result.error}`);
        // Si falla Supabase, guardar localmente
        const submission = { ...form, id: crypto.randomUUID(), date: new Date().toISOString() };
        saveSubmission(submission);
        toast.info("Guardado localmente como respaldo");
      }
    } catch (error) {
      toast.error("Error de conexión. Intenta nuevamente.");
      console.error('Submit error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="enviar" className="max-w-3xl mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold flex items-center gap-2"><BookOpen className="w-6 h-6"/> Proponer artículo científico</h2>
      <p className="text-muted-foreground mt-1">Para clubes de artículos, reseñas o entradas de blog académico. Los envíos se almacenan en nuestra base de datos y el equipo los revisará en breve.</p>

      <form onSubmit={onSubmit} className="grid gap-4 mt-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Título</label>
            <Input className="rounded-2xl" value={form.title} onChange={e=>setForm({...form, title:e.target.value})}/>
          </div>
          <div>
            <label className="text-sm font-medium">Autores</label>
            <Input className="rounded-2xl" placeholder="Apellido A, Apellido B" value={form.authors} onChange={e=>setForm({...form, authors:e.target.value})}/>
          </div>
        </div>
        <div>
          <label className="text-sm font-medium">Resumen (máx. 1200 caracteres)</label>
          <Textarea className="rounded-2xl min-h-[120px]" value={form.summary} onChange={e=>setForm({...form, summary:e.target.value})}/>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium">Palabras clave</label>
            <Input className="rounded-2xl" placeholder="coma, separadas" value={form.keywords} onChange={e=>setForm({...form, keywords:e.target.value})}/>
          </div>
          <div>
            <label className="text-sm font-medium">Área</label>
            <Select value={form.area} onValueChange={(v)=>setForm({...form, area:v})}>
              <SelectTrigger className="rounded-2xl"><SelectValue /></SelectTrigger>
              <SelectContent>
                {TAGS.filter(t=>t!=="Todos").map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium">DOI / enlace</label>
            <Input className="rounded-2xl" placeholder="https://doi.org/..." value={form.doi} onChange={e=>setForm({...form, doi:e.target.value})}/>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">PDF (URL opcional)</label>
            <Input className="rounded-2xl" placeholder="https://...pdf" value={form.pdf} onChange={e=>setForm({...form, pdf:e.target.value})}/>
          </div>
          <label className="flex items-center gap-2 text-sm mt-6 md:mt-0">
            <input type="checkbox" checked={form.ethics} onChange={e=>setForm({...form, ethics:e.target.checked})} className="scale-110"/>
            Declaro buenas prácticas, conflicto de interés y fuentes citadas.
          </label>
        </div>
        <div className="flex gap-3">
          <Button type="submit" className="rounded-2xl" disabled={loading}><Send className="w-4 h-4 mr-2"/>Enviar</Button>
          <Button type="button" variant="outline" className="rounded-2xl" onClick={()=>{
            const data = readSubmissions();
            const blob = new Blob([JSON.stringify(data, null, 2)], {type: "application/json"});
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url; a.download = "envios_ucimed_mi.json"; a.click(); URL.revokeObjectURL(url);
          }}>
            <FileText className="w-4 h-4 mr-2"/> Exportar envíos
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">✅ Base de datos conectada con Supabase. Los envíos se almacenan automáticamente y el equipo recibe notificaciones.</p>
      </form>
    </section>
  );
}

function Footer(){
  return (
    <footer className="border-t border-slate-200 mt-20 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-3 gap-10 text-sm">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 grid place-items-center">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <div className="font-bold text-lg bg-gradient-to-r from-blue-700 to-cyan-700 bg-clip-text text-transparent">
              Medicina Interna UCIMED
            </div>
          </div>
          <p className="text-slate-600 leading-relaxed">
            Divulgación académica estudiantil. Este sitio no sustituye criterio clínico. 
            Para emergencias, contacta a los servicios locales.
          </p>
        </div>
        <div>
          <div className="font-bold text-slate-800 mb-4">Contacto</div>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-slate-600 hover:text-blue-600 transition-colors">
              <Mail className="w-4 h-4"/> 
              <a href="mailto:medicinainterna.ucimed@gmail.com" className="hover:underline">
                medicinainterna.ucimed@gmail.com
              </a>
            </div>
            <div className="flex items-center gap-3 text-slate-600 hover:text-blue-600 transition-colors">
              <Instagram className="w-4 h-4"/> 
              <a href="https://instagram.com/medicina_interna_ucimed" className="hover:underline" target="_blank" rel="noreferrer">
                @medicina_interna_ucimed
              </a>
            </div>
          </div>
        </div>
        <div>
          <div className="font-bold text-slate-800 mb-4">Recursos</div>
          <ul className="space-y-2 text-slate-600">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
              Guías KDIGO, AHA/ACC, EULAR
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
              Plantilla para club de artículos
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
              Política de autoría y revisión
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-200 bg-white/50">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} UCIMED – Grupo de Interés en Medicina Interna. Desarrollado con ❤️ para estudiantes.
        </div>
      </div>
    </footer>
  );
}

export default function UCIMEDMedicinaInterna(){
  const [activeTab, setActiveTab] = useState("publicaciones");

  useEffect(()=>{
    // Inicializa almacenamiento si no existe
    if(!localStorage.getItem(STORAGE_KEY)) localStorage.setItem(STORAGE_KEY, "[]");
  },[]);

  const renderTabContent = () => {
    switch(activeTab) {
      case "publicaciones":
        return <Publicaciones/>;
      case "eventos":
        return <Eventos/>;
      case "equipo":
        return <Equipo/>;
      default:
        return <Publicaciones/>;
    }
  };

  return (
    <div className="min-h-screen">
      <Toaster richColors />
      <MedicalChatbot />
      <Navbar/>
      <Hero/>

      <div className="max-w-6xl mx-auto px-4 pt-10">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 rounded-2xl bg-gradient-to-r from-blue-50 to-cyan-50 p-1 shadow-lg">
            <TabsTrigger 
              value="publicaciones" 
              className="rounded-xl text-sm font-semibold transition-all duration-300 data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-blue-700"
            >
              📚 Publicaciones
            </TabsTrigger>
            <TabsTrigger 
              value="eventos" 
              className="rounded-xl text-sm font-semibold transition-all duration-300 data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-blue-700"
            >
              📅 Eventos
            </TabsTrigger>
            <TabsTrigger 
              value="equipo" 
              className="rounded-xl text-sm font-semibold transition-all duration-300 data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-blue-700"
            >
              👥 Equipo
            </TabsTrigger>
          </TabsList>
          
          <div className="mt-8">
            {renderTabContent()}
          </div>
        </Tabs>
      </div>

      <FormEnviar/>
      <Footer/>
    </div>
  );
}
