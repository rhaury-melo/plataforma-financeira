'use client'

import { useState, useRef } from 'react'
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  CreditCard, 
  PieChart, 
  Settings, 
  Plus, 
  Minus,
  Filter,
  Calendar,
  Target,
  AlertCircle,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Download,
  Eye,
  MapPin,
  Clock,
  X,
  Edit,
  Trash2,
  Mic,
  MicOff,
  FileText,
  Brain,
  Sparkles,
  TrendingUpIcon,
  AlertTriangle,
  ThumbsUp,
  Loader2,
  Save,
  Bell,
  Lock,
  User,
  Mail,
  Phone,
  Globe,
  Palette,
  Users,
  UserPlus
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Textarea } from '@/components/ui/textarea'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart as RechartsPieChart, Cell, LineChart, Line, Pie, Tooltip, Legend } from 'recharts'
import { analyzeFinancialCheckIn, transcribeAudio, type FinancialCheckIn, type FinancialAnalysis } from '@/lib/openai-client'
import { Switch } from '@/components/ui/switch'

// Tipo para membros da família/casal
interface FamilyMember {
  id: number
  name: string
  salary: number
  color: string
  avatar: string
}

// DADOS MOCK EXPANDIDOS PARA EXTRATO - MAIS REALISTAS E DETALHADOS
const initialMockTransactions = [
  // Dezembro 2024 - Transações Recentes
  { id: 1, type: 'expense', amount: 1250.00, category: 'Alimentação', description: 'Supermercado Extra', date: '2024-12-15', status: 'completed', location: 'Shopping Center Norte', time: '14:30', method: 'Cartão de Débito', memberId: 1 },
  { id: 2, type: 'income', amount: 6500.00, category: 'Salário', description: 'Salário Dezembro', date: '2024-12-01', status: 'completed', location: 'Transferência Bancária', time: '08:00', method: 'PIX', memberId: 1 },
  { id: 3, type: 'expense', amount: 850.00, category: 'Transporte', description: 'Combustível + Manutenção', date: '2024-12-14', status: 'completed', location: 'Posto Shell - Av. Paulista', time: '16:45', method: 'Cartão de Crédito', memberId: 1 },
  { id: 4, type: 'expense', amount: 1800.00, category: 'Moradia', description: 'Aluguel + Condomínio', date: '2024-12-01', status: 'completed', location: 'Boleto Bancário', time: '09:15', method: 'Débito Automático', memberId: 1 },
  { id: 5, type: 'income', amount: 800.00, category: 'Freelance', description: 'Projeto Website', date: '2024-12-10', status: 'completed', location: 'Transferência Online', time: '11:20', method: 'PIX', memberId: 1 },
  { id: 6, type: 'expense', amount: 320.00, category: 'Lazer', description: 'Cinema + Jantar', date: '2024-12-12', status: 'completed', location: 'Shopping Iguatemi', time: '19:30', method: 'Cartão de Crédito', memberId: 1 },
  { id: 7, type: 'expense', amount: 180.00, category: 'Saúde', description: 'Farmácia + Consulta', date: '2024-12-08', status: 'completed', location: 'Drogasil - Centro', time: '10:15', method: 'Cartão de Débito', memberId: 1 },
  { id: 8, type: 'income', amount: 450.00, category: 'Freelance', description: 'Consultoria TI', date: '2024-12-05', status: 'completed', location: 'Transferência Online', time: '15:45', method: 'TED', memberId: 1 },
  { id: 9, type: 'expense', amount: 280.00, category: 'Alimentação', description: 'Delivery + Restaurante', date: '2024-12-03', status: 'completed', location: 'iFood + Outback', time: '20:15', method: 'Cartão de Crédito', memberId: 1 },
  { id: 10, type: 'expense', amount: 95.00, category: 'Transporte', description: 'Uber + Ônibus', date: '2024-12-02', status: 'completed', location: 'Centro - Zona Sul', time: '07:30', method: 'Cartão de Crédito', memberId: 1 },
]

const initialMockCategories = [
  { id: 1, name: 'Alimentação', budget: 2000, spent: 1870, color: '#000000', icon: '🍽️' },
  { id: 2, name: 'Transporte', budget: 1200, spent: 945, color: '#333333', icon: '🚗' },
  { id: 3, name: 'Moradia', budget: 2500, spent: 2250, color: '#666666', icon: '🏠' },
  { id: 4, name: 'Lazer', budget: 600, spent: 395, color: '#999999', icon: '🎬' },
  { id: 5, name: 'Saúde', budget: 500, spent: 300, color: '#CCCCCC', icon: '⚕️' },
  { id: 6, name: 'Salário', budget: 0, spent: 0, color: '#4CAF50', icon: '💼' },
  { id: 7, name: 'Freelance', budget: 0, spent: 0, color: '#2196F3', icon: '💻' },
  { id: 8, name: 'Investimentos', budget: 0, spent: 0, color: '#FF9800', icon: '📈' },
]

const monthlyData = [
  { month: 'Jul', income: 7200, expenses: 5800 },
  { month: 'Ago', income: 6800, expenses: 5400 },
  { month: 'Set', income: 7500, expenses: 6200 },
  { month: 'Out', income: 7100, expenses: 5900 },
  { month: 'Nov', income: 6900, expenses: 5600 },
  { month: 'Dez', income: 7950, expenses: 6760 },
]

export default function FinancialPlatform() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false)
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false)
  const [dateFilter, setDateFilter] = useState('30-days')
  const [customDateFrom, setCustomDateFrom] = useState('')
  const [customDateTo, setCustomDateTo] = useState('')
  const [transactionTypeFilter, setTransactionTypeFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null)
  const [isTransactionDetailOpen, setIsTransactionDetailOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<any>(null)
  
  // Estados para Check-in Financeiro
  const [checkInMode, setCheckInMode] = useState<'text' | 'audio'>('text')
  const [checkInText, setCheckInText] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [checkIns, setCheckIns] = useState<FinancialCheckIn[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [currentAnalysis, setCurrentAnalysis] = useState<FinancialAnalysis | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  
  // Estado para gerenciar as transações (agora dinâmico)
  const [mockTransactions, setMockTransactions] = useState(initialMockTransactions)
  
  // Estado para gerenciar as categorias (agora dinâmico)
  const [mockCategories, setMockCategories] = useState(initialMockCategories)
  
  // Estados para gerenciar membros da família/casal
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([
    { id: 1, name: 'Você', salary: 6500, color: '#000000', avatar: '👤' }
  ])
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false)
  const [newMember, setNewMember] = useState({
    name: '',
    salary: '',
    color: '#333333',
    avatar: '👤'
  })
  const [selectedMemberFilter, setSelectedMemberFilter] = useState<number | 'all'>('all')
  
  // Estados de configurações
  const [userSettings, setUserSettings] = useState({
    name: 'João Silva',
    email: 'joao.silva@email.com',
    phone: '(11) 98765-4321',
    currency: 'BRL',
    language: 'pt-BR',
    notifications: {
      email: true,
      push: true,
      budget: true,
      transactions: false
    },
    privacy: {
      showBalance: true,
      shareData: false
    },
    theme: 'light'
  })
  
  // Estados do formulário de nova transação
  const [newTransaction, setNewTransaction] = useState({
    type: '',
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    location: '',
    method: '',
    memberId: 1
  })

  // Estados do formulário de nova categoria
  const [newCategory, setNewCategory] = useState({
    name: '',
    budget: '',
    color: '#000000',
    icon: '💰'
  })

  const availableAvatars = ['👤', '👨', '👩', '🧑', '👨‍💼', '👩‍💼', '👨‍🎓', '👩‍🎓', '👨‍⚕️', '👩‍⚕️', '👨‍🔧', '👩‍🔧']

  // Função para adicionar novo membro
  const handleAddMember = () => {
    if (!newMember.name || !newMember.salary) {
      alert('Por favor, preencha todos os campos obrigatórios.')
      return
    }

    const member: FamilyMember = {
      id: Math.max(...familyMembers.map(m => m.id)) + 1,
      name: newMember.name,
      salary: parseFloat(newMember.salary.replace(',', '.')),
      color: newMember.color,
      avatar: newMember.avatar
    }

    setFamilyMembers(prev => [...prev, member])
    setIsAddMemberOpen(false)
    setNewMember({
      name: '',
      salary: '',
      color: '#333333',
      avatar: '👤'
    })
    alert(`Membro "${member.name}" adicionado com sucesso!`)
  }

  // Função para deletar membro
  const handleDeleteMember = (memberId: number) => {
    if (familyMembers.length === 1) {
      alert('Você não pode deletar o único membro!')
      return
    }
    if (confirm('Tem certeza que deseja remover este membro?')) {
      setFamilyMembers(prev => prev.filter(m => m.id !== memberId))
      // Reatribuir transações do membro deletado para o primeiro membro
      setMockTransactions(prev => prev.map(t => 
        t.memberId === memberId ? { ...t, memberId: familyMembers[0].id } : t
      ))
      alert('Membro removido com sucesso!')
    }
  }

  // Função para iniciar gravação de áudio - CORRIGIDA
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        setAudioBlob(audioBlob)
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (error) {
      // Tratamento silencioso do erro - não mostra no console
      if (error instanceof DOMException && error.name === 'NotAllowedError') {
        alert('⚠️ Permissão de microfone negada.\n\nPara usar a gravação de áudio:\n1. Clique no ícone de cadeado/configurações na barra de endereço\n2. Permita o acesso ao microfone\n3. Recarregue a página e tente novamente')
      } else {
        alert('Não foi possível acessar o microfone. Verifique as permissões do navegador.')
      }
    }
  }

  // Função para parar gravação
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  // Função para processar check-in
  const handleCheckInSubmit = async () => {
    setIsAnalyzing(true)
    try {
      let content = checkInText

      // Se for áudio, transcrever primeiro
      if (checkInMode === 'audio' && audioBlob) {
        content = await transcribeAudio(audioBlob)
      }

      if (!content.trim()) {
        alert('Por favor, forneça informações sobre sua vida financeira.')
        setIsAnalyzing(false)
        return
      }

      // Criar check-in
      const checkIn: FinancialCheckIn = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        type: checkInMode,
        content,
        audioUrl: audioBlob ? URL.createObjectURL(audioBlob) : undefined
      }

      // Analisar com IA
      const analysis = await analyzeFinancialCheckIn(checkIn)
      checkIn.analysis = analysis

      // Salvar check-in
      setCheckIns(prev => [checkIn, ...prev])
      setCurrentAnalysis(analysis)

      // Limpar formulário
      setCheckInText('')
      setAudioBlob(null)
      
      // Mudar para aba de análise
      setActiveTab('analysis')
    } catch (error) {
      console.error('Erro ao processar check-in:', error)
      alert('Erro ao processar check-in. Verifique se a API Key está configurada.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  // Função para resetar o formulário de transação
  const resetTransactionForm = () => {
    setNewTransaction({
      type: '',
      amount: '',
      category: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      location: '',
      method: '',
      memberId: familyMembers[0]?.id || 1
    })
  }

  // Função para resetar o formulário de categoria
  const resetCategoryForm = () => {
    setNewCategory({
      name: '',
      budget: '',
      color: '#000000',
      icon: '💰'
    })
  }

  // Função para adicionar nova transação
  const handleAddTransaction = () => {
    if (!newTransaction.type || !newTransaction.amount || !newTransaction.category || !newTransaction.description) {
      alert('Por favor, preencha todos os campos obrigatórios.')
      return
    }

    const transaction = {
      id: Math.max(...mockTransactions.map(t => t.id)) + 1,
      type: newTransaction.type,
      amount: parseFloat(newTransaction.amount.replace(',', '.')),
      category: newTransaction.category,
      description: newTransaction.description,
      date: newTransaction.date,
      status: 'completed',
      location: newTransaction.location || 'Local não informado',
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      method: newTransaction.method || 'Não informado',
      memberId: newTransaction.memberId
    }

    setMockTransactions(prev => [transaction, ...prev])
    setIsAddTransactionOpen(false)
    resetTransactionForm()
    alert(`Transação "${transaction.description}" adicionada com sucesso!`)
  }

  // Função para adicionar nova categoria
  const handleAddCategory = () => {
    if (!newCategory.name || !newCategory.budget) {
      alert('Por favor, preencha todos os campos obrigatórios.')
      return
    }

    const categoryExists = mockCategories.some(cat => 
      cat.name.toLowerCase() === newCategory.name.toLowerCase()
    )

    if (categoryExists) {
      alert('Já existe uma categoria com este nome.')
      return
    }

    const category = {
      id: Math.max(...mockCategories.map(c => c.id)) + 1,
      name: newCategory.name,
      budget: parseFloat(newCategory.budget.replace(',', '.')),
      spent: 0,
      color: newCategory.color,
      icon: newCategory.icon
    }

    setMockCategories(prev => [...prev, category])
    setIsAddCategoryOpen(false)
    resetCategoryForm()
    alert(`Categoria "${category.name}" criada com sucesso!`)
  }

  // Função para editar categoria
  const handleEditCategory = (category: any) => {
    setEditingCategory(category)
  }

  // Função para salvar edição de categoria
  const handleSaveCategory = () => {
    if (!editingCategory) return

    setMockCategories(prev => 
      prev.map(cat => 
        cat.id === editingCategory.id ? editingCategory : cat
      )
    )
    setEditingCategory(null)
    alert('Categoria atualizada com sucesso!')
  }

  // Função para deletar categoria
  const handleDeleteCategory = (categoryId: number) => {
    if (confirm('Tem certeza que deseja deletar esta categoria?')) {
      setMockCategories(prev => prev.filter(cat => cat.id !== categoryId))
      alert('Categoria deletada com sucesso!')
    }
  }

  // Função para deletar transação
  const handleDeleteTransaction = (transactionId: number) => {
    if (confirm('Tem certeza que deseja deletar esta transação?')) {
      setMockTransactions(prev => prev.filter(t => t.id !== transactionId))
      setIsTransactionDetailOpen(false)
      alert('Transação deletada com sucesso!')
    }
  }

  // Função para salvar configurações
  const handleSaveSettings = () => {
    alert('Configurações salvas com sucesso!')
  }

  // Função para filtrar transações por data
  const getFilteredTransactions = () => {
    const now = new Date()
    let startDate = new Date()

    switch (dateFilter) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        break
      case '7-days':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case '30-days':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      case '90-days':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
        break
      case 'this-year':
        startDate = new Date(now.getFullYear(), 0, 1)
        break
      case 'custom':
        if (customDateFrom && customDateTo) {
          startDate = new Date(customDateFrom)
          const endDate = new Date(customDateTo)
          return mockTransactions.filter(transaction => {
            const transactionDate = new Date(transaction.date)
            const matchesDate = transactionDate >= startDate && transactionDate <= endDate
            const matchesType = transactionTypeFilter === 'all' || transaction.type === transactionTypeFilter
            const matchesCategory = categoryFilter === 'all' || transaction.category === categoryFilter
            const matchesMember = selectedMemberFilter === 'all' || transaction.memberId === selectedMemberFilter
            const matchesSearch = searchTerm === '' || 
              transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
              transaction.category.toLowerCase().includes(searchTerm.toLowerCase())
            return matchesDate && matchesType && matchesCategory && matchesMember && matchesSearch
          })
        }
        return mockTransactions.filter(transaction => {
          const matchesType = transactionTypeFilter === 'all' || transaction.type === transactionTypeFilter
          const matchesCategory = categoryFilter === 'all' || transaction.category === categoryFilter
          const matchesMember = selectedMemberFilter === 'all' || transaction.memberId === selectedMemberFilter
          const matchesSearch = searchTerm === '' || 
            transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            transaction.category.toLowerCase().includes(searchTerm.toLowerCase())
          return matchesType && matchesCategory && matchesMember && matchesSearch
        })
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    }

    return mockTransactions.filter(transaction => {
      const transactionDate = new Date(transaction.date)
      const matchesDate = transactionDate >= startDate
      const matchesType = transactionTypeFilter === 'all' || transaction.type === transactionTypeFilter
      const matchesCategory = categoryFilter === 'all' || transaction.category === categoryFilter
      const matchesMember = selectedMemberFilter === 'all' || transaction.memberId === selectedMemberFilter
      const matchesSearch = searchTerm === '' || 
        transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.category.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesDate && matchesType && matchesCategory && matchesMember && matchesSearch
    })
  }

  // CÁLCULOS PRINCIPAIS
  const allTransactions = mockTransactions
  const totalIncome = allTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0)
  const totalExpenses = allTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)
  const balance = totalIncome - totalExpenses

  // Cálculo do salário total da família
  const totalFamilySalary = familyMembers.reduce((sum, member) => sum + member.salary, 0)

  const filteredTransactions = getFilteredTransactions()
  const filteredIncome = filteredTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0)
  const filteredExpenses = filteredTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)
  const filteredBalance = filteredIncome - filteredExpenses

  const pieChartData = mockCategories.map(category => ({
    name: category.name,
    value: category.spent,
    color: category.color
  }))

  const renderTooltip = (props: any) => {
    if (props.active && props.payload && props.payload.length) {
      const data = props.payload[0]
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-black">{data.name}</p>
          <p className="text-sm text-gray-600">
            R$ {data.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-gray-500">
            {((data.value / pieChartData.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(1)}% do total
          </p>
        </div>
      )
    }
    return null
  }

  const openTransactionDetail = (transaction: any) => {
    setSelectedTransaction(transaction)
    setIsTransactionDetailOpen(true)
  }

  const getCategoryIcon = (category: string) => {
    const categoryData = mockCategories.find(cat => cat.name === category)
    return categoryData?.icon || '💰'
  }

  const getMemberById = (memberId: number) => {
    return familyMembers.find(m => m.id === memberId) || familyMembers[0]
  }

  const availableIcons = [
    '💰', '🍽️', '🚗', '🏠', '🎬', '⚕️', '💼', '💻', '📈', '🛒', 
    '✈️', '🎓', '👕', '📱', '🏋️', '🎵', '📚', '🎮', '🍕', '☕'
  ]

  const renderFamilyManagement = () => (
    <Card className="border-gray-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-black flex items-center gap-2">
            <Users className="h-5 w-5" />
            Gerenciar Membros da Família
          </CardTitle>
          <Dialog open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
            <DialogTrigger asChild>
              <Button className="bg-black text-white hover:bg-gray-800">
                <UserPlus className="h-4 w-4 mr-2" />
                Adicionar Membro
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Adicionar Novo Membro</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Nome</Label>
                  <Input
                    placeholder="Ex: Maria Silva"
                    value={newMember.name}
                    onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Salário Mensal (R$)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={newMember.salary}
                    onChange={(e) => setNewMember({...newMember, salary: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Cor de Identificação</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={newMember.color}
                      onChange={(e) => setNewMember({...newMember, color: e.target.value})}
                      className="w-20 h-10"
                    />
                    <Input
                      value={newMember.color}
                      onChange={(e) => setNewMember({...newMember, color: e.target.value})}
                      placeholder="#000000"
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Avatar</Label>
                  <div className="grid grid-cols-6 gap-2">
                    {availableAvatars.map((avatar) => (
                      <button
                        key={avatar}
                        onClick={() => setNewMember({...newMember, avatar})}
                        className={`text-2xl p-2 rounded border-2 hover:bg-gray-50 transition-colors ${
                          newMember.avatar === avatar ? 'border-black bg-gray-100' : 'border-gray-200'
                        }`}
                      >
                        {avatar}
                      </button>
                    ))}
                  </div>
                </div>
                <Button onClick={handleAddMember} className="w-full bg-black text-white hover:bg-gray-800">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Membro
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {familyMembers.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
            >
              <div className="flex items-center gap-4">
                <div className="text-3xl">{member.avatar}</div>
                <div>
                  <p className="font-medium text-black">{member.name}</p>
                  <p className="text-sm text-gray-600">
                    Salário: R$ {member.salary.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-full border-2 border-gray-300"
                  style={{ backgroundColor: member.color }}
                />
                {familyMembers.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteMember(member.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                )}
              </div>
            </div>
          ))}
          
          {/* Resumo Total */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex justify-between items-center">
              <span className="font-medium text-black">Renda Total da Família:</span>
              <span className="text-2xl font-bold text-green-600">
                R$ {totalFamilySalary.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const renderCheckIn = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-black">Check-in Financeiro</h2>
          <p className="text-gray-600 mt-1">Conte como está sua vida financeira - em texto ou áudio</p>
        </div>
      </div>

      {/* Modo de Check-in */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="text-black flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Novo Check-in
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Seletor de Modo */}
          <div className="flex gap-4">
            <Button
              variant={checkInMode === 'text' ? 'default' : 'outline'}
              onClick={() => setCheckInMode('text')}
              className={checkInMode === 'text' ? 'bg-black text-white' : 'border-gray-300'}
            >
              <FileText className="h-4 w-4 mr-2" />
              Texto
            </Button>
            <Button
              variant={checkInMode === 'audio' ? 'default' : 'outline'}
              onClick={() => setCheckInMode('audio')}
              className={checkInMode === 'audio' ? 'bg-black text-white' : 'border-gray-300'}
            >
              <Mic className="h-4 w-4 mr-2" />
              Áudio
            </Button>
          </div>

          {/* Modo Texto */}
          {checkInMode === 'text' && (
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium mb-2 block">
                  Descreva sua situação financeira atual
                </Label>
                <Textarea
                  placeholder="Exemplo: Meu salário esse mês foi de R$ 6.500. Gastei R$ 1.200 com alimentação no supermercado e restaurantes, R$ 850 com transporte (combustível e Uber), R$ 1.800 com aluguel e condomínio, R$ 320 com lazer (cinema e jantar), e R$ 180 com saúde (farmácia). Também tive uma renda extra de R$ 800 com um projeto freelance..."
                  value={checkInText}
                  onChange={(e) => setCheckInText(e.target.value)}
                  rows={8}
                  className="resize-none"
                />
                <p className="text-xs text-gray-500 mt-2">
                  💡 Dica: Seja detalhado! Mencione valores, categorias e como você se sente sobre seus gastos.
                </p>
              </div>
            </div>
          )}

          {/* Modo Áudio */}
          {checkInMode === 'audio' && (
            <div className="space-y-4">
              <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
                {!isRecording && !audioBlob && (
                  <div className="text-center">
                    <Mic className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600 mb-4">Clique para começar a gravar</p>
                    <Button
                      onClick={startRecording}
                      className="bg-black text-white hover:bg-gray-800"
                    >
                      <Mic className="h-4 w-4 mr-2" />
                      Iniciar Gravação
                    </Button>
                  </div>
                )}

                {isRecording && (
                  <div className="text-center">
                    <div className="relative">
                      <Mic className="h-12 w-12 mx-auto mb-4 text-red-500 animate-pulse" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 border-4 border-red-500 rounded-full animate-ping opacity-75"></div>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-4 font-medium">Gravando...</p>
                    <Button
                      onClick={stopRecording}
                      variant="destructive"
                    >
                      <MicOff className="h-4 w-4 mr-2" />
                      Parar Gravação
                    </Button>
                  </div>
                )}

                {audioBlob && !isRecording && (
                  <div className="text-center w-full">
                    <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                    <p className="text-gray-600 mb-4 font-medium">Áudio gravado com sucesso!</p>
                    <audio controls src={URL.createObjectURL(audioBlob)} className="w-full mb-4" />
                    <Button
                      onClick={() => setAudioBlob(null)}
                      variant="outline"
                      className="border-gray-300"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Gravar Novamente
                    </Button>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 text-center">
                💡 Dica: Fale naturalmente sobre seu salário, gastos e como você se sente sobre suas finanças.
              </p>
            </div>
          )}

          {/* Botão de Enviar */}
          <Button
            onClick={handleCheckInSubmit}
            disabled={isAnalyzing || (checkInMode === 'text' && !checkInText.trim()) || (checkInMode === 'audio' && !audioBlob)}
            className="w-full bg-black text-white hover:bg-gray-800"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Analisando com IA...
              </>
            ) : (
              <>
                <Brain className="h-4 w-4 mr-2" />
                Analisar com IA
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Histórico de Check-ins */}
      {checkIns.length > 0 && (
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-black">Histórico de Check-ins</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {checkIns.map((checkIn) => (
                <div
                  key={checkIn.id}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => {
                    setCurrentAnalysis(checkIn.analysis || null)
                    setActiveTab('analysis')
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {checkIn.type === 'audio' ? (
                          <Mic className="h-4 w-4 text-gray-500" />
                        ) : (
                          <FileText className="h-4 w-4 text-gray-500" />
                        )}
                        <span className="text-sm font-medium text-gray-900">
                          {new Date(checkIn.date).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {checkIn.content.substring(0, 150)}...
                      </p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )

  const renderAnalysis = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-black">Análise Financeira por IA</h2>
          <p className="text-gray-600 mt-1">Insights e recomendações personalizadas</p>
        </div>
      </div>

      {!currentAnalysis ? (
        <Card className="border-gray-200">
          <CardContent className="p-12 text-center">
            <Brain className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Nenhuma análise disponível
            </h3>
            <p className="text-gray-600 mb-6">
              Faça um check-in financeiro para receber uma análise detalhada por IA
            </p>
            <Button
              onClick={() => setActiveTab('checkin')}
              className="bg-black text-white hover:bg-gray-800"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Fazer Check-in
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Resumo Executivo */}
          <Card className="border-gray-200 bg-gradient-to-br from-gray-50 to-white">
            <CardHeader>
              <CardTitle className="text-black flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-yellow-500" />
                Resumo Executivo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {currentAnalysis.summary}
              </p>
            </CardContent>
          </Card>

          {/* Cards de Métricas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="border-gray-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Receitas Totais</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  R$ {currentAnalysis.totalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Despesas Totais</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  R$ {currentAnalysis.totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Saldo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${currentAnalysis.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  R$ {currentAnalysis.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Taxa de Economia</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-black">
                  {currentAnalysis.savingsRate.toFixed(1)}%
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Distribuição por Categoria */}
          {currentAnalysis.categoryBreakdown.length > 0 && (
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-black">Distribuição por Categoria</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentAnalysis.categoryBreakdown.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-900">{item.category}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-black">
                            R$ {item.amount.toLocaleString('pt-BR')}
                          </span>
                          <Badge variant="outline" className="border-gray-300">
                            {item.percentage.toFixed(1)}%
                          </Badge>
                        </div>
                      </div>
                      <Progress value={item.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Insights */}
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-black flex items-center gap-2">
                <TrendingUpIcon className="h-5 w-5 text-blue-500" />
                Insights Detalhados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {currentAnalysis.insights.map((insight, index) => (
                  <div key={index} className="flex gap-3 p-3 bg-blue-50 rounded-lg">
                    <div className="flex-shrink-0 mt-0.5">
                      <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">{insight}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recomendações */}
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-black flex items-center gap-2">
                <Target className="h-5 w-5 text-green-500" />
                Recomendações Personalizadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {currentAnalysis.recommendations.map((recommendation, index) => (
                  <div key={index} className="flex gap-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-700 leading-relaxed">{recommendation}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Áreas de Risco e Pontos Fortes */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Áreas de Risco */}
            {currentAnalysis.riskAreas.length > 0 && (
              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle className="text-black flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    Áreas de Atenção
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {currentAnalysis.riskAreas.map((risk, index) => (
                      <div key={index} className="flex gap-3 p-3 bg-red-50 rounded-lg">
                        <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-gray-700">{risk}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Pontos Fortes */}
            {currentAnalysis.strengths.length > 0 && (
              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle className="text-black flex items-center gap-2">
                    <ThumbsUp className="h-5 w-5 text-green-500" />
                    Pontos Fortes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {currentAnalysis.strengths.map((strength, index) => (
                      <div key={index} className="flex gap-3 p-3 bg-green-50 rounded-lg">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-gray-700">{strength}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </>
      )}
    </div>
  )

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Gerenciamento de Membros */}
      {renderFamilyManagement()}

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Saldo Total</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">
              R$ {balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-gray-500 flex items-center mt-1">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              +12% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Receitas</CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">
              R$ {totalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-gray-500">Este mês</p>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Despesas</CardTitle>
            <TrendingDown className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">
              R$ {totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-gray-500">Este mês</p>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Taxa de Economia</CardTitle>
            <Target className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">
              {totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(1) : '0.0'}%
            </div>
            <p className="text-xs text-gray-500">Meta: 20%</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-black">Fluxo de Caixa Mensal</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <XAxis dataKey="month" stroke="#666" />
                <YAxis stroke="#666" />
                <Bar dataKey="income" fill="#000000" name="Receitas" />
                <Bar dataKey="expenses" fill="#666666" name="Despesas" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-black flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Gastos por Categoria
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={renderTooltip} />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  formatter={(value, entry: any) => (
                    <span style={{ color: entry.color, fontSize: '12px' }}>
                      {value}
                    </span>
                  )}
                />
              </RechartsPieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Orçamentos */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="text-black">Controle de Orçamento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockCategories.map((category) => {
              const percentage = (category.spent / category.budget) * 100
              const isOverBudget = percentage > 100
              
              return (
                <div key={category.name} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-black">{category.name}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">
                        R$ {category.spent.toLocaleString('pt-BR')} / R$ {category.budget.toLocaleString('pt-BR')}
                      </span>
                      {isOverBudget ? (
                        <AlertCircle className="h-4 w-4 text-red-500" />
                      ) : (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                  </div>
                  <Progress 
                    value={Math.min(percentage, 100)} 
                    className="h-2"
                  />
                  <div className="text-xs text-gray-500">
                    {percentage.toFixed(1)}% do orçamento utilizado
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderTransactions = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-black">Extrato Completo</h2>
          <p className="text-gray-600 mt-1">Todas as suas transações em um só lugar</p>
        </div>
        <Dialog open={isAddTransactionOpen} onOpenChange={setIsAddTransactionOpen}>
          <DialogTrigger asChild>
            <Button className="bg-black text-white hover:bg-gray-800">
              <Plus className="h-4 w-4 mr-2" />
              Nova Transação
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Adicionar Nova Transação</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Membro</Label>
                <Select value={newTransaction.memberId.toString()} onValueChange={(value) => setNewTransaction({...newTransaction, memberId: parseInt(value)})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o membro" />
                  </SelectTrigger>
                  <SelectContent>
                    {familyMembers.map(member => (
                      <SelectItem key={member.id} value={member.id.toString()}>
                        {member.avatar} {member.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Tipo</Label>
                <Select value={newTransaction.type} onValueChange={(value) => setNewTransaction({...newTransaction, type: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">Receita</SelectItem>
                    <SelectItem value="expense">Despesa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Valor (R$)</Label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={newTransaction.amount}
                  onChange={(e) => setNewTransaction({...newTransaction, amount: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Categoria</Label>
                <Select value={newTransaction.category} onValueChange={(value) => setNewTransaction({...newTransaction, category: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockCategories.map(cat => (
                      <SelectItem key={cat.id} value={cat.name}>{cat.icon} {cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Descrição</Label>
                <Input
                  placeholder="Ex: Supermercado"
                  value={newTransaction.description}
                  onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Data</Label>
                <Input
                  type="date"
                  value={newTransaction.date}
                  onChange={(e) => setNewTransaction({...newTransaction, date: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Local (opcional)</Label>
                <Input
                  placeholder="Ex: Shopping Center"
                  value={newTransaction.location}
                  onChange={(e) => setNewTransaction({...newTransaction, location: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Método de Pagamento (opcional)</Label>
                <Select value={newTransaction.method} onValueChange={(value) => setNewTransaction({...newTransaction, method: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o método" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cartão de Crédito">Cartão de Crédito</SelectItem>
                    <SelectItem value="Cartão de Débito">Cartão de Débito</SelectItem>
                    <SelectItem value="PIX">PIX</SelectItem>
                    <SelectItem value="Dinheiro">Dinheiro</SelectItem>
                    <SelectItem value="TED">TED</SelectItem>
                    <SelectItem value="Boleto">Boleto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleAddTransaction} className="w-full bg-black text-white hover:bg-gray-800">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Transação
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtros */}
      <Card className="border-gray-200">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="space-y-2">
              <Label className="text-sm">Membro</Label>
              <Select value={selectedMemberFilter.toString()} onValueChange={(value) => setSelectedMemberFilter(value === 'all' ? 'all' : parseInt(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {familyMembers.map(member => (
                    <SelectItem key={member.id} value={member.id.toString()}>
                      {member.avatar} {member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Período</Label>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Hoje</SelectItem>
                  <SelectItem value="7-days">Últimos 7 dias</SelectItem>
                  <SelectItem value="30-days">Últimos 30 dias</SelectItem>
                  <SelectItem value="90-days">Últimos 90 dias</SelectItem>
                  <SelectItem value="this-year">Este ano</SelectItem>
                  <SelectItem value="custom">Personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Tipo</Label>
              <Select value={transactionTypeFilter} onValueChange={setTransactionTypeFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="income">Receitas</SelectItem>
                  <SelectItem value="expense">Despesas</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Categoria</Label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {mockCategories.map(cat => (
                    <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar transação..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resumo do Período Filtrado */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-gray-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Receitas no Período</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              R$ {filteredIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>
        <Card className="border-gray-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Despesas no Período</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              R$ {filteredExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>
        <Card className="border-gray-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Saldo no Período</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${filteredBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              R$ {filteredBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Transações */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="text-black">Transações ({filteredTransactions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-8">
                <CreditCard className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p className="text-gray-600">Nenhuma transação encontrada</p>
              </div>
            ) : (
              filteredTransactions.map((transaction) => {
                const member = getMemberById(transaction.memberId)
                return (
                  <div
                    key={transaction.id}
                    onClick={() => openTransactionDetail(transaction)}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-2xl">{getCategoryIcon(transaction.category)}</div>
                      <div>
                        <p className="font-medium text-black">{transaction.description}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                          <span className="flex items-center gap-1">
                            {member.avatar} {member.name}
                          </span>
                          <span>•</span>
                          <span>{transaction.category}</span>
                          <span>•</span>
                          <span>{new Date(transaction.date).toLocaleDateString('pt-BR')}</span>
                          <span>•</span>
                          <span>{transaction.time}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                        {transaction.type === 'income' ? '+' : '-'} R$ {transaction.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{transaction.method}</p>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </CardContent>
      </Card>

      {/* Dialog de Detalhes da Transação */}
      <Dialog open={isTransactionDetailOpen} onOpenChange={setIsTransactionDetailOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Detalhes da Transação</DialogTitle>
          </DialogHeader>
          {selectedTransaction && (
            <div className="space-y-4 py-4">
              <div className="flex items-center justify-center">
                <div className="text-6xl">{getCategoryIcon(selectedTransaction.category)}</div>
              </div>
              <div className="text-center">
                <p className={`text-3xl font-bold ${selectedTransaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                  {selectedTransaction.type === 'income' ? '+' : '-'} R$ {selectedTransaction.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-lg font-medium text-black mt-2">{selectedTransaction.description}</p>
              </div>
              <div className="space-y-3 pt-4 border-t">
                <div className="flex justify-between">
                  <span className="text-gray-600">Membro:</span>
                  <span className="font-medium text-black flex items-center gap-1">
                    {getMemberById(selectedTransaction.memberId).avatar} {getMemberById(selectedTransaction.memberId).name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Categoria:</span>
                  <span className="font-medium text-black">{selectedTransaction.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Data:</span>
                  <span className="font-medium text-black">{new Date(selectedTransaction.date).toLocaleDateString('pt-BR')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Horário:</span>
                  <span className="font-medium text-black">{selectedTransaction.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Método:</span>
                  <span className="font-medium text-black">{selectedTransaction.method}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Local:</span>
                  <span className="font-medium text-black">{selectedTransaction.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <Badge variant="outline" className="border-green-500 text-green-600">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Concluída
                  </Badge>
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => handleDeleteTransaction(selectedTransaction.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Deletar
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setIsTransactionDetailOpen(false)}
                >
                  Fechar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )

  const renderCategories = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-black">Gerenciar Categorias</h2>
          <p className="text-gray-600 mt-1">Organize seus gastos e receitas por categoria</p>
        </div>
        <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
          <DialogTrigger asChild>
            <Button className="bg-black text-white hover:bg-gray-800">
              <Plus className="h-4 w-4 mr-2" />
              Nova Categoria
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Criar Nova Categoria</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Nome da Categoria</Label>
                <Input
                  placeholder="Ex: Educação"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Orçamento Mensal (R$)</Label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={newCategory.budget}
                  onChange={(e) => setNewCategory({...newCategory, budget: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Cor</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={newCategory.color}
                    onChange={(e) => setNewCategory({...newCategory, color: e.target.value})}
                    className="w-20 h-10"
                  />
                  <Input
                    value={newCategory.color}
                    onChange={(e) => setNewCategory({...newCategory, color: e.target.value})}
                    placeholder="#000000"
                    className="flex-1"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Ícone</Label>
                <div className="grid grid-cols-10 gap-2">
                  {availableIcons.map((icon) => (
                    <button
                      key={icon}
                      onClick={() => setNewCategory({...newCategory, icon})}
                      className={`text-2xl p-2 rounded border-2 hover:bg-gray-50 transition-colors ${
                        newCategory.icon === icon ? 'border-black bg-gray-100' : 'border-gray-200'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
              <Button onClick={handleAddCategory} className="w-full bg-black text-white hover:bg-gray-800">
                <Plus className="h-4 w-4 mr-2" />
                Criar Categoria
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Lista de Categorias */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockCategories.map((category) => {
          const percentage = category.budget > 0 ? (category.spent / category.budget) * 100 : 0
          const isOverBudget = percentage > 100
          
          return (
            <Card key={category.id} className="border-gray-200">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{category.icon}</div>
                    <div>
                      <CardTitle className="text-lg text-black">{category.name}</CardTitle>
                      <p className="text-sm text-gray-500 mt-1">
                        {category.budget > 0 ? `Orçamento: R$ ${category.budget.toLocaleString('pt-BR')}` : 'Sem orçamento'}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditCategory(category)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteCategory(category.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Gasto:</span>
                  <span className="font-semibold text-black">
                    R$ {category.spent.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                {category.budget > 0 && (
                  <>
                    <Progress value={Math.min(percentage, 100)} className="h-2" />
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">
                        {percentage.toFixed(1)}% utilizado
                      </span>
                      {isOverBudget ? (
                        <Badge variant="destructive" className="text-xs">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Acima do orçamento
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs border-green-500 text-green-600">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Dentro do orçamento
                        </Badge>
                      )}
                    </div>
                  </>
                )}
                <div
                  className="w-full h-2 rounded-full mt-2"
                  style={{ backgroundColor: category.color }}
                />
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Dialog de Edição de Categoria */}
      <Dialog open={!!editingCategory} onOpenChange={(open) => !open && setEditingCategory(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Categoria</DialogTitle>
          </DialogHeader>
          {editingCategory && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Nome da Categoria</Label>
                <Input
                  value={editingCategory.name}
                  onChange={(e) => setEditingCategory({...editingCategory, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Orçamento Mensal (R$)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={editingCategory.budget}
                  onChange={(e) => setEditingCategory({...editingCategory, budget: parseFloat(e.target.value) || 0})}
                />
              </div>
              <div className="space-y-2">
                <Label>Cor</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={editingCategory.color}
                    onChange={(e) => setEditingCategory({...editingCategory, color: e.target.value})}
                    className="w-20 h-10"
                  />
                  <Input
                    value={editingCategory.color}
                    onChange={(e) => setEditingCategory({...editingCategory, color: e.target.value})}
                    className="flex-1"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Ícone</Label>
                <div className="grid grid-cols-10 gap-2">
                  {availableIcons.map((icon) => (
                    <button
                      key={icon}
                      onClick={() => setEditingCategory({...editingCategory, icon})}
                      className={`text-2xl p-2 rounded border-2 hover:bg-gray-50 transition-colors ${
                        editingCategory.icon === icon ? 'border-black bg-gray-100' : 'border-gray-200'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
              <Button onClick={handleSaveCategory} className="w-full bg-black text-white hover:bg-gray-800">
                <Save className="h-4 w-4 mr-2" />
                Salvar Alterações
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )

  const renderSettings = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-black">Configurações</h2>
        <p className="text-gray-600 mt-1">Personalize sua experiência no CFinance</p>
      </div>

      {/* Perfil do Usuário */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="text-black flex items-center gap-2">
            <User className="h-5 w-5" />
            Perfil do Usuário
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Nome Completo</Label>
            <Input
              value={userSettings.name}
              onChange={(e) => setUserSettings({...userSettings, name: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="email"
                value={userSettings.email}
                onChange={(e) => setUserSettings({...userSettings, email: e.target.value})}
                className="pl-10"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Telefone</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="tel"
                value={userSettings.phone}
                onChange={(e) => setUserSettings({...userSettings, phone: e.target.value})}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preferências Regionais */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="text-black flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Preferências Regionais
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Moeda</Label>
            <Select value={userSettings.currency} onValueChange={(value) => setUserSettings({...userSettings, currency: value})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BRL">Real Brasileiro (R$)</SelectItem>
                <SelectItem value="USD">Dólar Americano ($)</SelectItem>
                <SelectItem value="EUR">Euro (€)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Idioma</Label>
            <Select value={userSettings.language} onValueChange={(value) => setUserSettings({...userSettings, language: value})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                <SelectItem value="en-US">English (US)</SelectItem>
                <SelectItem value="es-ES">Español</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Notificações */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="text-black flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notificações
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-black">Notificações por Email</p>
              <p className="text-sm text-gray-500">Receba atualizações por email</p>
            </div>
            <Switch
              checked={userSettings.notifications.email}
              onCheckedChange={(checked) => setUserSettings({
                ...userSettings,
                notifications: {...userSettings.notifications, email: checked}
              })}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-black">Notificações Push</p>
              <p className="text-sm text-gray-500">Receba notificações no navegador</p>
            </div>
            <Switch
              checked={userSettings.notifications.push}
              onCheckedChange={(checked) => setUserSettings({
                ...userSettings,
                notifications: {...userSettings.notifications, push: checked}
              })}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-black">Alertas de Orçamento</p>
              <p className="text-sm text-gray-500">Avisos quando ultrapassar orçamento</p>
            </div>
            <Switch
              checked={userSettings.notifications.budget}
              onCheckedChange={(checked) => setUserSettings({
                ...userSettings,
                notifications: {...userSettings.notifications, budget: checked}
              })}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-black">Alertas de Transações</p>
              <p className="text-sm text-gray-500">Notificações de novas transações</p>
            </div>
            <Switch
              checked={userSettings.notifications.transactions}
              onCheckedChange={(checked) => setUserSettings({
                ...userSettings,
                notifications: {...userSettings.notifications, transactions: checked}
              })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Privacidade e Segurança */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="text-black flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Privacidade e Segurança
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-black">Mostrar Saldo</p>
              <p className="text-sm text-gray-500">Exibir saldo na tela inicial</p>
            </div>
            <Switch
              checked={userSettings.privacy.showBalance}
              onCheckedChange={(checked) => setUserSettings({
                ...userSettings,
                privacy: {...userSettings.privacy, showBalance: checked}
              })}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-black">Compartilhar Dados</p>
              <p className="text-sm text-gray-500">Ajudar a melhorar o serviço</p>
            </div>
            <Switch
              checked={userSettings.privacy.shareData}
              onCheckedChange={(checked) => setUserSettings({
                ...userSettings,
                privacy: {...userSettings.privacy, shareData: checked}
              })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Aparência */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="text-black flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Aparência
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Tema</Label>
            <Select value={userSettings.theme} onValueChange={(value) => setUserSettings({...userSettings, theme: value})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Claro</SelectItem>
                <SelectItem value="dark">Escuro</SelectItem>
                <SelectItem value="auto">Automático</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Botão Salvar */}
      <Button onClick={handleSaveSettings} className="w-full bg-black text-white hover:bg-gray-800">
        <Save className="h-4 w-4 mr-2" />
        Salvar Configurações
      </Button>
    </div>
  )

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-black">CFinance</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Semana</SelectItem>
                  <SelectItem value="month">Mês</SelectItem>
                  <SelectItem value="year">Ano</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-6 bg-gray-50">
              <TabsTrigger value="dashboard" className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </TabsTrigger>
              <TabsTrigger value="checkin" className="flex items-center space-x-2">
                <Mic className="h-4 w-4" />
                <span className="hidden sm:inline">Check-in</span>
              </TabsTrigger>
              <TabsTrigger value="analysis" className="flex items-center space-x-2">
                <Brain className="h-4 w-4" />
                <span className="hidden sm:inline">Análise IA</span>
              </TabsTrigger>
              <TabsTrigger value="transactions" className="flex items-center space-x-2">
                <CreditCard className="h-4 w-4" />
                <span className="hidden sm:inline">Extrato</span>
              </TabsTrigger>
              <TabsTrigger value="categories" className="flex items-center space-x-2">
                <PieChart className="h-4 w-4" />
                <span className="hidden sm:inline">Categorias</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center space-x-2">
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Config</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsContent value="dashboard">
            {renderDashboard()}
          </TabsContent>
          <TabsContent value="checkin">
            {renderCheckIn()}
          </TabsContent>
          <TabsContent value="analysis">
            {renderAnalysis()}
          </TabsContent>
          <TabsContent value="transactions">
            {renderTransactions()}
          </TabsContent>
          <TabsContent value="categories">
            {renderCategories()}
          </TabsContent>
          <TabsContent value="settings">
            {renderSettings()}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
