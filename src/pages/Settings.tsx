import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  User, 
  Mail, 
  Lock, 
  CreditCard, 
  Calendar,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { Card } from '../styles/GlobalStyles';

const SettingsContainer = styled.div`
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
`;

const PageTitle = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin-bottom: 32px;
`;

const Section = styled.div`
  margin-bottom: 32px;
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const UserInfoCard = styled(Card)`
  margin-bottom: 24px;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Input = styled.input<{ disabled?: boolean }>`
  padding: 12px 16px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 14px;
  background: ${props => props.disabled ? props.theme.colors.surface : props.theme.colors.background};
  color: ${props => props.disabled ? props.theme.colors.textSecondary : props.theme.colors.text};
  cursor: ${props => props.disabled ? 'not-allowed' : 'text'};
  opacity: ${props => props.disabled ? 0.7 : 1};

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.accent};
  }
`;

const PasswordField = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const PasswordInput = styled(Input)`
  padding-right: 48px;
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  padding: 4px;

  &:hover {
    color: ${props => props.theme.colors.accent};
  }
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;

  ${props => props.variant === 'secondary' ? `
    background: ${props.theme.colors.surface};
    color: ${props.theme.colors.text};
    border: 1px solid ${props.theme.colors.border};

    &:hover {
      background: ${props.theme.colors.border};
    }
  ` : `
    background: ${props.theme.colors.accent};
    color: white;

    &:hover {
      background: ${props.theme.colors.accentSecondary};
    }
  `}
`;

const OrderHistoryTable = styled.div`
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: ${props => props.theme.colors.surface};
  border-radius: 8px;
  overflow: hidden;
`;

const TableHeader = styled.thead`
  background: ${props => props.theme.colors.background};
`;

const TableRow = styled.tr`
  border-bottom: 1px solid ${props => props.theme.colors.border};

  &:last-child {
    border-bottom: none;
  }
`;

const TableHeaderCell = styled.th`
  padding: 16px;
  text-align: left;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  font-size: 14px;
`;

const TableCell = styled.td`
  padding: 16px;
  color: ${props => props.theme.colors.text};
  font-size: 14px;
`;

const PaymentMethod = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CardBrand = styled.span<{ brand: string }>`
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  
  ${props => {
    switch (props.brand) {
      case 'visa':
        return `
          background: #1a1f71;
          color: white;
        `;
      case 'mastercard':
        return `
          background: #eb001b;
          color: white;
        `;
      case 'elo':
        return `
          background: #ffcb05;
          color: black;
        `;
      default:
        return `
          background: ${props.theme.colors.surface};
          color: ${props.theme.colors.text};
        `;
    }
  }}
`;

const StatusBadge = styled.span<{ status: 'approved' | 'rejected' }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  
  ${props => props.status === 'approved' ? `
    background: ${props.theme.colors.success}20;
    color: ${props.theme.colors.success};
  ` : `
    background: ${props.theme.colors.error}20;
    color: ${props.theme.colors.error};
  `}
`;

const DisabledNote = styled.p`
  font-size: 12px;
  color: ${props => props.theme.colors.textSecondary};
  margin-top: 4px;
  font-style: italic;
`;

const Settings: React.FC = () => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Mock user data
  const userData = {
    name: 'João Silva',
    email: 'joao.silva@email.com'
  };

  // Mock order history
  const orderHistory = [
    {
      id: '001',
      date: '2024-01-15',
      paymentMethod: 'pix',
      status: 'approved' as const,
      amount: 'R$ 297,00'
    },
    {
      id: '002',
      date: '2024-02-20',
      paymentMethod: 'credit_card',
      cardBrand: 'visa',
      cardLast4: '4532',
      status: 'approved' as const,
      amount: 'R$ 497,00'
    },
    {
      id: '003',
      date: '2024-03-10',
      paymentMethod: 'credit_card',
      cardBrand: 'mastercard',
      cardLast4: '8765',
      status: 'rejected' as const,
      amount: 'R$ 197,00'
    },
    {
      id: '004',
      date: '2024-03-25',
      paymentMethod: 'pix',
      status: 'approved' as const,
      amount: 'R$ 397,00'
    }
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const renderPaymentMethod = (order: typeof orderHistory[0]) => {
    if (order.paymentMethod === 'pix') {
      return (
        <PaymentMethod>
          <CreditCard size={16} />
          PIX
        </PaymentMethod>
      );
    }

    return (
      <PaymentMethod>
        <CreditCard size={16} />
        <div>
          <CardBrand brand={order.cardBrand || ''}>{order.cardBrand}</CardBrand>
          <span style={{ marginLeft: '8px' }}>•••• {order.cardLast4}</span>
        </div>
      </PaymentMethod>
    );
  };

  return (
    <SettingsContainer>
      <PageTitle>Minha Conta</PageTitle>

      <Section>
        <SectionTitle>
          <User size={20} />
          Informações Pessoais
        </SectionTitle>
        
        <UserInfoCard>
          <FormGrid>
            <FormField>
              <Label>
                <User size={16} />
                Nome Completo
              </Label>
              <Input 
                type="text" 
                value={userData.name} 
                disabled 
              />
              <DisabledNote>
                Para alterar seu nome, entre em contato com o suporte
              </DisabledNote>
            </FormField>

            <FormField>
              <Label>
                <Mail size={16} />
                E-mail
              </Label>
              <Input 
                type="email" 
                value={userData.email} 
                disabled 
              />
              <DisabledNote>
                Para alterar seu e-mail, entre em contato com o suporte
              </DisabledNote>
            </FormField>
          </FormGrid>
        </UserInfoCard>
      </Section>

      <Section>
        <SectionTitle>
          <Lock size={20} />
          Alterar Senha
        </SectionTitle>
        
        <UserInfoCard>
          <FormGrid>
            <FormField>
              <Label>Senha Atual</Label>
              <PasswordField>
                <PasswordInput 
                  type={showCurrentPassword ? 'text' : 'password'}
                  placeholder="Digite sua senha atual"
                />
                <PasswordToggle 
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </PasswordToggle>
              </PasswordField>
            </FormField>

            <FormField>
              <Label>Nova Senha</Label>
              <PasswordField>
                <PasswordInput 
                  type={showNewPassword ? 'text' : 'password'}
                  placeholder="Digite sua nova senha"
                />
                <PasswordToggle 
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </PasswordToggle>
              </PasswordField>
            </FormField>

            <FormField>
              <Label>Confirmar Nova Senha</Label>
              <PasswordField>
                <PasswordInput 
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirme sua nova senha"
                />
                <PasswordToggle 
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </PasswordToggle>
              </PasswordField>
            </FormField>
          </FormGrid>

          <div style={{ display: 'flex', gap: '12px' }}>
            <Button variant="primary">Alterar Senha</Button>
            <Button variant="secondary">Cancelar</Button>
          </div>
        </UserInfoCard>
      </Section>

      <Section>
        <SectionTitle>
          <Calendar size={20} />
          Histórico de Pedidos
        </SectionTitle>
        
        <UserInfoCard>
          <OrderHistoryTable>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHeaderCell>Pedido</TableHeaderCell>
                  <TableHeaderCell>Data</TableHeaderCell>
                  <TableHeaderCell>Forma de Pagamento</TableHeaderCell>
                  <TableHeaderCell>Valor</TableHeaderCell>
                  <TableHeaderCell>Status</TableHeaderCell>
                </TableRow>
              </TableHeader>
              <tbody>
                {orderHistory.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>#{order.id}</TableCell>
                    <TableCell>{formatDate(order.date)}</TableCell>
                    <TableCell>{renderPaymentMethod(order)}</TableCell>
                    <TableCell>{order.amount}</TableCell>
                    <TableCell>
                      <StatusBadge status={order.status}>
                        {order.status === 'approved' ? (
                          <>
                            <CheckCircle size={12} />
                            Aprovado
                          </>
                        ) : (
                          <>
                            <XCircle size={12} />
                            Rejeitado
                          </>
                        )}
                      </StatusBadge>
                    </TableCell>
                  </TableRow>
                ))}
              </tbody>
            </Table>
          </OrderHistoryTable>
        </UserInfoCard>
      </Section>
    </SettingsContainer>
  );
};

export default Settings;